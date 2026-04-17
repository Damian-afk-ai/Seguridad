import Fastify from 'fastify';
import cors from '@fastify/cors';
import 'dotenv/config';

import { loginRoute } from './routes/login.js';
import { registerRoute } from './routes/register.js';
import { sessionRoute } from './routes/session.js';
import { healthRoute } from './routes/health.js';

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });

// Registrar rutas bajo /auth
app.register(loginRoute, { prefix: '/auth' });
app.register(registerRoute, { prefix: '/auth' });
app.register(sessionRoute, { prefix: '/auth' });
app.register(healthRoute, { prefix: '/auth' });

const PORT = Number(process.env.AUTH_PORT) || 3001;

app.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
  if (err) { app.log.error(err); process.exit(1); }
  console.log(`🔐 Auth Service corriendo en :${PORT}`);
});
