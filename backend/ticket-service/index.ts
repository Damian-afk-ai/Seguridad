import Fastify from 'fastify';
import cors from '@fastify/cors';
import fjwt from '@fastify/jwt';
import 'dotenv/config';

import { ticketRoutes } from './routes/tickets.js';
import { healthRoute } from './routes/health.js';

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(fjwt, { secret: process.env.JWT_SECRET! });

// ── Middleware global: verificar JWT en todas las rutas excepto /health ──
app.addHook('onRequest', async (request, reply) => {
  // Skip health check
  if (request.url === '/tickets/health') return;

  try {
    await request.jwtVerify();
  } catch {
    reply.status(401).send({
      statusCode: 401,
      intOpCode: 'SxTI401',
      data: null,
      timestamp: new Date().toISOString(),
      service: 'ticket-service',
    });
  }
});

app.register(ticketRoutes, { prefix: '/tickets' });
app.register(healthRoute, { prefix: '/tickets' });

const PORT = Number(process.env.TICKET_PORT) || 3002;

app.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
  if (err) { app.log.error(err); process.exit(1); }
  console.log(`🎫 Ticket Service corriendo en :${PORT}`);
});
