import { FastifyPluginAsync } from 'fastify';
import { getSupabase } from '../../shared/supabase.js';
import { respond } from '../../shared/response.js';
import type { JwtPayload } from '../../shared/types.js';

const SERVICE = 'user-service';

export const permissionRoutes: FastifyPluginAsync = async (app) => {

  // ── GET /permissions/:groupId ─────────────────────────────────────────
  app.get('/:groupId', async (request, reply) => {
    const user = request.user as JwtPayload;

    if (!user.permissions.includes('user:manage_permissions')) {
      return reply.status(403).send(respond(403, SERVICE, 'permissions', null));
    }

    const { groupId } = request.params as { groupId: string };
    const sb = getSupabase();

    const { data, error } = await sb
      .from('permissions')
      .select('id, group_id, resource, can_view, can_create, can_edit, can_delete')
      .eq('group_id', groupId);

    if (error) {
      console.error(`[${SERVICE}] Error leyendo permissions:`, error.message);
      return reply.status(500).send(respond(500, SERVICE, 'permissions', null));
    }

    return reply.send(respond(200, SERVICE, 'permissions', data ?? []));
  });

  // ── PATCH /permissions/:id — toggle individual ────────────────────────
  app.patch('/:id', async (request, reply) => {
    const user = request.user as JwtPayload;

    if (!user.permissions.includes('user:manage_permissions')) {
      return reply.status(403).send(respond(403, SERVICE, 'permissions', null));
    }

    const { id } = request.params as { id: string };
    const body = request.body as Record<string, any>;
    const sb = getSupabase();

    // Solo permitir campos de permiso
    const allowed: Record<string, any> = {};
    if (body.can_view !== undefined) allowed.can_view = body.can_view;
    if (body.can_create !== undefined) allowed.can_create = body.can_create;
    if (body.can_edit !== undefined) allowed.can_edit = body.can_edit;
    if (body.can_delete !== undefined) allowed.can_delete = body.can_delete;

    const { error } = await sb
      .from('permissions')
      .update(allowed)
      .eq('id', id);

    if (error) {
      console.error(`[${SERVICE}] Error actualizando permission ${id}:`, error.message);
      return reply.status(500).send(respond(500, SERVICE, 'permissions', null));
    }

    return reply.send(respond(200, SERVICE, 'permissions', null));
  });
};
