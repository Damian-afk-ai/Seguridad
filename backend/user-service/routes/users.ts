import { FastifyPluginAsync } from 'fastify';
import { getSupabase } from '../../shared/supabase.js';
import { respond } from '../../shared/response.js';
import type { JwtPayload } from '../../shared/types.js';

const SERVICE = 'user-service';

export const userRoutes: FastifyPluginAsync = async (app) => {

  // ── GET /users ────────────────────────────────────────────────────────
  app.get('/', async (request, reply) => {
    const user = request.user as JwtPayload;

    if (!user.permissions.includes('user:view') && !user.permissions.includes('users:view')) {
      return reply.status(403).send(respond(403, SERVICE, 'users', null));
    }

    const sb = getSupabase();
    const { data, error } = await sb
      .from('users')
      .select('id, full_name, email, group_id, puesto')
      .order('full_name');

    if (error) {
      console.error(`[${SERVICE}] Error listando users:`, error.message);
      return reply.status(500).send(respond(500, SERVICE, 'users', null));
    }

    return reply.send(respond(200, SERVICE, 'users', data ?? []));
  });

  // ── PATCH /users/:id ──────────────────────────────────────────────────
  app.patch('/:id', async (request, reply) => {
    const user = request.user as JwtPayload;

    if (!user.permissions.includes('user:edit')) {
      return reply.status(403).send(respond(403, SERVICE, 'users', null));
    }

    const { id } = request.params as { id: string };
    const body = request.body as Record<string, any>;
    const sb = getSupabase();

    // Solo permitir campos seguros
    const allowed: Record<string, any> = {};
    if (body.full_name !== undefined) allowed.full_name = body.full_name;
    if (body.puesto !== undefined) allowed.puesto = body.puesto;
    if (body.group_id !== undefined) allowed.group_id = body.group_id;

    const { data, error } = await sb
      .from('users')
      .update(allowed)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`[${SERVICE}] Error actualizando user ${id}:`, error.message);
      return reply.status(500).send(respond(500, SERVICE, 'users', null));
    }

    return reply.send(respond(200, SERVICE, 'users', data));
  });

  // ── DELETE /users/:id ─────────────────────────────────────────────────
  app.delete('/:id', async (request, reply) => {
    const user = request.user as JwtPayload;

    if (!user.permissions.includes('user:delete')) {
      return reply.status(403).send(respond(403, SERVICE, 'users', null));
    }

    const { id } = request.params as { id: string };
    const sb = getSupabase();

    const { error } = await sb.from('users').delete().eq('id', id);

    if (error) {
      console.error(`[${SERVICE}] Error eliminando user ${id}:`, error.message);
      return reply.status(500).send(respond(500, SERVICE, 'users', null));
    }

    return reply.send(respond(200, SERVICE, 'users', null));
  });
};
