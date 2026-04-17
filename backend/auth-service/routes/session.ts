import { FastifyPluginAsync } from 'fastify';
import fjwt from '@fastify/jwt';
import { getSupabase } from '../../shared/supabase.js';
import { respond } from '../../shared/response.js';
import type { JwtPayload } from '../../shared/types.js';

const SERVICE = 'auth-service';

export const sessionRoute: FastifyPluginAsync = async (app) => {
  await app.register(fjwt, { secret: process.env.JWT_SECRET! });

  // GET /auth/session — Valida JWT y devuelve perfil actualizado
  app.get('/session', async (request, reply) => {
    try {
      const decoded = await request.jwtVerify<JwtPayload>();

      // Refrescar datos desde DB
      const sb = getSupabase();
      const { data: profile } = await sb
        .from('users')
        .select('id, full_name, email, group_id, puesto')
        .eq('id', decoded.userId)
        .single();

      if (!profile) {
        return reply.status(404).send(respond(404, SERVICE, 'users', null));
      }

      // Re-leer permisos actualizados
      let permissions: string[] = decoded.permissions;
      if (profile.group_id) {
        const { data: permRows } = await sb
          .from('permissions')
          .select('resource, can_view, can_create, can_edit, can_delete')
          .eq('group_id', profile.group_id);

        if (permRows && permRows.length > 0) {
          permissions = mapPermissions(permRows);
        }
      }

      return reply.send(
        respond(200, SERVICE, 'users', {
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name,
          puesto: profile.puesto,
          groupId: profile.group_id,
          permissions,
        })
      );
    } catch {
      return reply.status(401).send(respond(401, SERVICE, 'users', null));
    }
  });
};

/** Mismo mapeo que login.ts */
function mapPermissions(rows: any[]): string[] {
  const result: string[] = [];
  for (const row of rows) {
    const r = row.resource as string;
    if (row.can_view) {
      result.push(`${r}:view`);
      if (r === 'user') result.push('users:view');
    }
    if (row.can_create) {
      result.push(`${r}:create`, `${r}:add`);
      if (r === 'ticket') result.push('ticket:assign', 'ticket:comment', 'ticket:change_status', 'ticket:edit_state');
      if (r === 'group') result.push('group:add_member', 'group:remove_member');
      if (r === 'user') result.push('user:manage_permissions');
    }
    if (row.can_edit) {
      result.push(`${r}:edit`);
      if (r === 'ticket') result.push('ticket:edit_state', 'ticket:change_status', 'ticket:comment');
    }
    if (row.can_delete) result.push(`${r}:delete`);
  }
  return [...new Set(result)];
}
