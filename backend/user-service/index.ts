import Fastify from 'fastify';
import cors from '@fastify/cors';
import fjwt from '@fastify/jwt';
import 'dotenv/config';

import { userRoutes } from './routes/users.js';
import { groupRoutes } from './routes/groups.js';
import { permissionRoutes } from './routes/permissions.js';
import { healthRoute } from './routes/health.js';

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(fjwt, { secret: process.env.JWT_SECRET! });

// ── Middleware global: verificar JWT excepto health ──────────────────
app.addHook('onRequest', async (request, reply) => {
  if (request.url.endsWith('/health')) return;

  try {
    await request.jwtVerify();
  } catch {
    reply.status(401).send({
      statusCode: 401,
      intOpCode: 'SxUS401',
      data: null,
      timestamp: new Date().toISOString(),
      service: 'user-service',
    });
  }
});

app.register(userRoutes, { prefix: '/users' });
app.register(groupRoutes, { prefix: '/groups' });
app.register(permissionRoutes, { prefix: '/permissions' });
app.register(healthRoute, { prefix: '/users' });

const PORT = Number(process.env.USER_PORT) || 3003;

app.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
  if (err) { app.log.error(err); process.exit(1); }
  console.log(`👤 User Service corriendo en :${PORT}`);
});
