import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import 'dotenv/config';

import { proxyRoutes } from './proxy.js';

const app = Fastify({ logger: true });

// ── CORS: solo permitir frontend Angular ─────────────────────────────
await app.register(cors, {
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});

// ── Rate Limiting global: 100 requests/min por IP ────────────────────
await app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  errorResponseBuilder: () => ({
    statusCode: 429,
    intOpCode: 'SxGW429',
    data: null,
    timestamp: new Date().toISOString(),
    service: 'gateway',
  }),
});

// ── Proxy routes hacia microservicios ────────────────────────────────
app.register(proxyRoutes);

// ── Health del Gateway mismo ─────────────────────────────────────────
app.get('/health', async () => ({
  statusCode: 200,
  intOpCode: 'SxHE200',
  data: {
    gateway: 'OK',
    services: {
      auth: `http://localhost:${process.env.AUTH_PORT || 3001}`,
      tickets: `http://localhost:${process.env.TICKET_PORT || 3002}`,
      users: `http://localhost:${process.env.USER_PORT || 3003}`,
    },
  },
  timestamp: new Date().toISOString(),
  service: 'gateway',
}));

const PORT = Number(process.env.GATEWAY_PORT) || 3000;

app.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
  if (err) { app.log.error(err); process.exit(1); }
  console.log(`🚪 API Gateway corriendo en :${PORT}`);
  console.log(`   → Auth Service:   http://localhost:${process.env.AUTH_PORT || 3001}`);
  console.log(`   → Ticket Service: http://localhost:${process.env.TICKET_PORT || 3002}`);
  console.log(`   → User Service:   http://localhost:${process.env.USER_PORT || 3003}`);
});
