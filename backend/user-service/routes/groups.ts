import { FastifyPluginAsync } from 'fastify';
import { getSupabase } from '../../shared/supabase.js';
import { respond } from '../../shared/response.js';
import type { JwtPayload } from '../../shared/types.js';

const SERVICE = 'user-service';

export const groupRoutes: FastifyPluginAsync = async (app) => {

  // ── GET /groups ───────────────────────────────────────────────────────
  app.get('/', async (request, reply) => {
    const user = request.user as JwtPayload;

    if (!user.permissions.includes('group:view')) {
      return reply.status(403).send(respond(403, SERVICE, 'groups', null));
    }

    const sb = getSupabase();
    const { data, error } = await sb
      .from('groups')
      .select('id, name, description')
      .order('name');

    if (error) {
      console.error(`[${SERVICE}] Error listando groups:`, error.message);
      return reply.status(500).send(respond(500, SERVICE, 'groups', null));
    }

    return reply.send(respond(200, SERVICE, 'groups', data ?? []));
  });
};
