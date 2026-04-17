import { FastifyPluginAsync } from 'fastify';
import fjwt from '@fastify/jwt';
import { getSupabase } from '../../shared/supabase.js';
import { respond } from '../../shared/response.js';

const SERVICE = 'auth-service';

/**
 * Mapea filas de DB permissions → array de strings Permission[].
 * Misma lógica que el frontend para mantener compatibilidad.
 */
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
      if (r === 'ticket') {
        result.push('ticket:assign', 'ticket:comment', 'ticket:change_status', 'ticket:edit_state');
      }
      if (r === 'group') {
        result.push('group:add_member', 'group:remove_member');
      }
      if (r === 'user') {
        result.push('user:manage_permissions');
      }
    }
    if (row.can_edit) {
      result.push(`${r}:edit`);
      if (r === 'ticket') {
        result.push('ticket:edit_state', 'ticket:change_status', 'ticket:comment');
      }
    }
    if (row.can_delete) {
      result.push(`${r}:delete`);
    }
  }
  return [...new Set(result)];
}

export const loginRoute: FastifyPluginAsync = async (app) => {
  // Registrar JWT plugin
  await app.register(fjwt, { secret: process.env.JWT_SECRET! });

  app.post('/login', async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };
    const sb = getSupabase();

    // 1. Autenticar con Supabase Auth
    const { data, error } = await sb.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      return reply.status(401).send(respond(401, SERVICE, 'users', null));
    }

    const authUser = data.user;

    // 2. Leer perfil de tabla users
    const { data: profile } = await sb
      .from('users')
      .select('id, full_name, email, group_id, puesto')
      .eq('id', authUser.id)
      .single();

    // 3. Leer permisos del grupo
    let permissions: string[] = [];
    if (profile?.group_id) {
      const { data: permRows } = await sb
        .from('permissions')
        .select('resource, can_view, can_create, can_edit, can_delete')
        .eq('group_id', profile.group_id);

      if (permRows && permRows.length > 0) {
        permissions = mapPermissions(permRows);
      }
    }

    // 4. Firmar JWT propio del backend
    const token = app.jwt.sign(
      {
        userId: authUser.id,
        email: authUser.email,
        groupId: profile?.group_id ?? null,
        permissions,
      },
      { expiresIn: '8h' }
    );

    // 5. Responder con token + usuario
    return reply.send(
      respond(200, SERVICE, 'users', {
        token,
        user: {
          id: authUser.id,
          email: authUser.email ?? '',
          fullName: profile?.full_name ?? '',
          username: authUser.user_metadata?.username ?? authUser.email ?? '',
          puesto: profile?.puesto ?? null,
          groupId: profile?.group_id ?? null,
          permissions,
        },
      })
    );
  });
};
