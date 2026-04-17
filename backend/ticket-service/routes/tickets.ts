import { FastifyPluginAsync } from 'fastify';
import { getSupabase } from '../../shared/supabase.js';
import { respond } from '../../shared/response.js';
import type { JwtPayload } from '../../shared/types.js';

const SERVICE = 'ticket-service';

export const ticketRoutes: FastifyPluginAsync = async (app) => {

  // ── GET /tickets?group_id=xxx ─────────────────────────────────────────
  app.get('/', async (request, reply) => {
    const user = request.user as JwtPayload;

    if (!user.permissions.includes('ticket:view')) {
      return reply.status(403).send(respond(403, SERVICE, 'tickets', null));
    }

    const { group_id } = request.query as { group_id?: string };

    if (!group_id) {
      return reply.status(400).send(respond(400, SERVICE, 'tickets', { message: 'group_id requerido' }));
    }

    const sb = getSupabase();
    const { data, error } = await sb
      .from('tickets')
      .select('id, title, description, created_at, created_by, group_id, status, priority, assignee, due_date')
      .eq('group_id', group_id)
      .order('id', { ascending: false });

    if (error) {
      console.error(`[${SERVICE}] Error listando tickets:`, error.message);
      return reply.status(500).send(respond(500, SERVICE, 'tickets', null));
    }

    return reply.send(respond(200, SERVICE, 'tickets', data));
  });

  // ── POST /tickets ─────────────────────────────────────────────────────
  app.post('/', async (request, reply) => {
    const user = request.user as JwtPayload;

    if (!user.permissions.includes('ticket:create')) {
      return reply.status(403).send(respond(403, SERVICE, 'tickets', null));
    }

    const body = request.body as Record<string, any>;
    const sb = getSupabase();

    const { data, error } = await sb
      .from('tickets')
      .insert({
        title: body.title,
        description: body.description ?? '',
        created_by: user.userId,
        group_id: body.group_id,
        status: body.status ?? 'Pendiente',
        priority: body.priority ?? 'Media',
        assignee: body.assignee ?? null,
        due_date: body.due_date ?? null,
      })
      .select()
      .single();

    if (error) {
      // Rate limit trigger de PostgreSQL (P0001)
      if (error.code === 'P0001') {
        console.warn(`[${SERVICE}] Rate limit excedido para usuario ${user.userId}`);
        return reply.status(429).send(respond(429, SERVICE, 'tickets', null));
      }
      console.error(`[${SERVICE}] Error creando ticket:`, error.message);
      return reply.status(500).send(respond(500, SERVICE, 'tickets', null));
    }

    return reply.status(201).send(respond(201, SERVICE, 'tickets', data));
  });

  // ── PATCH /tickets/:id ────────────────────────────────────────────────
  app.patch('/:id', async (request, reply) => {
    const user = request.user as JwtPayload;

    if (!user.permissions.includes('ticket:edit')) {
      return reply.status(403).send(respond(403, SERVICE, 'tickets', null));
    }

    const { id } = request.params as { id: string };
    const body = request.body as Record<string, any>;
    const sb = getSupabase();

    const { data, error } = await sb
      .from('tickets')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`[${SERVICE}] Error actualizando ticket ${id}:`, error.message);
      return reply.status(500).send(respond(500, SERVICE, 'tickets', null));
    }

    return reply.send(respond(200, SERVICE, 'tickets', data));
  });

  // ── PATCH /tickets/:id/move — Drag-and-drop Kanban ────────────────────
  app.patch('/:id/move', async (request, reply) => {
    const user = request.user as JwtPayload;
    const { id } = request.params as { id: string };
    const { newState, assigneeId } = request.body as { newState: string; assigneeId: string };

    // Regla 1: permiso ticket:change_status
    if (!user.permissions.includes('ticket:change_status')) {
      return reply.status(403).send(respond(403, SERVICE, 'tickets', null));
    }

    // Regla 2: ownership — ticket debe estar asignado al usuario
    console.log(`[TICKET] Intentando mover ticket ${id} por usuario ${user.userId}. Asignado a: "${assigneeId}" (tipo: ${typeof assigneeId})`);

    const isUnassigned = !assigneeId || assigneeId === '';
    const isOwner = assigneeId === user.userId;
    const hasAllTicketPerms = [
      'ticket:view', 'ticket:create', 'ticket:edit',
      'ticket:delete', 'ticket:change_status',
    ].every(p => user.permissions.includes(p));

    console.log(`[TICKET] Evaluando reglas: isUnassigned=${isUnassigned}, isOwner=${isOwner}, hasAllTicketPerms=${hasAllTicketPerms}`);

    if (!isUnassigned && !isOwner && !hasAllTicketPerms) {
      console.log(`[TICKET] Rechazado por reglas de negocio`);
      return reply.status(403).send({
        statusCode: 403,
        intOpCode: 'SxTI403_OWNER',
        data: null,
        timestamp: new Date().toISOString(),
        service: SERVICE,
      });
    }

    console.log(`[TICKET] Enviando query a supabase: status=${newState}, id=${id}`);
    const sb = getSupabase();
    const { data, error } = await sb
      .from('tickets')
      .update({ status: newState })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`[${SERVICE}] Error de Supabase moviendo ticket ${id}:`, JSON.stringify(error));
      return reply.status(500).send(respond(500, SERVICE, 'tickets', null));
    }

    console.log(`[TICKET] Ticket movido exitosamente`);
    return reply.send(respond(200, SERVICE, 'tickets', data));
  });

  // ── DELETE /tickets/:id ───────────────────────────────────────────────
  app.delete('/:id', async (request, reply) => {
    const user = request.user as JwtPayload;

    if (!user.permissions.includes('ticket:delete')) {
      return reply.status(403).send(respond(403, SERVICE, 'tickets', null));
    }

    const { id } = request.params as { id: string };
    const sb = getSupabase();

    const { error } = await sb.from('tickets').delete().eq('id', id);

    if (error) {
      console.error(`[${SERVICE}] Error eliminando ticket ${id}:`, error.message);
      return reply.status(500).send(respond(500, SERVICE, 'tickets', null));
    }

    return reply.send(respond(200, SERVICE, 'tickets', null));
  });
};
