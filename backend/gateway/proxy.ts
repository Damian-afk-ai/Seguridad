import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import 'dotenv/config';

const AUTH_URL   = `http://localhost:${process.env.AUTH_PORT || 3001}`;
const TICKET_URL = `http://localhost:${process.env.TICKET_PORT || 3002}`;
const USER_URL   = `http://localhost:${process.env.USER_PORT || 3003}`;

// ── Helper: reenviar request a un microservicio ────────────────────────
async function forward(
  targetBase: string,
  path: string,
  method: string,
  authHeader?: string,
  body?: any
): Promise<{ status: number; data: any }> {
  const url = `${targetBase}${path}`;

  const headers: Record<string, string> = {};
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  const options: RequestInit = { method, headers };
  if (body && method !== 'GET' && method !== 'HEAD') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    return { status: res.status, data };
  } catch (err: any) {
    console.error(`[Gateway] Error forwarding ${method} ${url}:`, err.message);
    return {
      status: 502,
      data: {
        statusCode: 502,
        intOpCode: 'SxGW502',
        data: null,
        timestamp: new Date().toISOString(),
        service: 'gateway',
      },
    };
  }
}

/** Extrae Authorization header de request */
function auth(req: FastifyRequest): string | undefined {
  return req.headers.authorization;
}

export const proxyRoutes: FastifyPluginAsync = async (app) => {

  // ════════════════════════════════════════════════════════════════════════
  //   AUTH SERVICE  →  /api/auth/*
  // ════════════════════════════════════════════════════════════════════════

  app.post('/api/auth/login', async (req, reply) => {
    const { status, data } = await forward(AUTH_URL, '/auth/login', 'POST', undefined, req.body);
    return reply.status(status).send(data);
  });

  app.post('/api/auth/register', async (req, reply) => {
    const { status, data } = await forward(AUTH_URL, '/auth/register', 'POST', undefined, req.body);
    return reply.status(status).send(data);
  });

  app.get('/api/auth/session', async (req, reply) => {
    const { status, data } = await forward(AUTH_URL, '/auth/session', 'GET', auth(req));
    return reply.status(status).send(data);
  });

  app.get('/api/auth/health', async (req, reply) => {
    const { status, data } = await forward(AUTH_URL, '/auth/health', 'GET');
    return reply.status(status).send(data);
  });

  // ════════════════════════════════════════════════════════════════════════
  //   TICKET SERVICE  →  /api/tickets/*
  // ════════════════════════════════════════════════════════════════════════

  app.get('/api/tickets', async (req, reply) => {
    const q = (req.query as any).group_id ? `?group_id=${(req.query as any).group_id}` : '';
    const { status, data } = await forward(TICKET_URL, `/tickets${q}`, 'GET', auth(req));
    return reply.status(status).send(data);
  });

  app.post('/api/tickets', async (req, reply) => {
    const { status, data } = await forward(TICKET_URL, '/tickets', 'POST', auth(req), req.body);
    return reply.status(status).send(data);
  });

  app.patch('/api/tickets/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const { status, data } = await forward(TICKET_URL, `/tickets/${id}`, 'PATCH', auth(req), req.body);
    return reply.status(status).send(data);
  });

  app.patch('/api/tickets/:id/move', async (req, reply) => {
    const { id } = req.params as { id: string };
    const { status, data } = await forward(TICKET_URL, `/tickets/${id}/move`, 'PATCH', auth(req), req.body);
    return reply.status(status).send(data);
  });

  app.delete('/api/tickets/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const { status, data } = await forward(TICKET_URL, `/tickets/${id}`, 'DELETE', auth(req));
    return reply.status(status).send(data);
  });

  app.get('/api/tickets/health', async (req, reply) => {
    const { status, data } = await forward(TICKET_URL, '/tickets/health', 'GET');
    return reply.status(status).send(data);
  });

  // ════════════════════════════════════════════════════════════════════════
  //   USER SERVICE  →  /api/users/*, /api/groups/*, /api/permissions/*
  // ════════════════════════════════════════════════════════════════════════

  app.get('/api/users', async (req, reply) => {
    const { status, data } = await forward(USER_URL, '/users', 'GET', auth(req));
    return reply.status(status).send(data);
  });

  app.patch('/api/users/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const { status, data } = await forward(USER_URL, `/users/${id}`, 'PATCH', auth(req), req.body);
    return reply.status(status).send(data);
  });

  app.delete('/api/users/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const { status, data } = await forward(USER_URL, `/users/${id}`, 'DELETE', auth(req));
    return reply.status(status).send(data);
  });

  app.get('/api/groups', async (req, reply) => {
    const { status, data } = await forward(USER_URL, '/groups', 'GET', auth(req));
    return reply.status(status).send(data);
  });

  app.get('/api/permissions/:groupId', async (req, reply) => {
    const { groupId } = req.params as { groupId: string };
    const { status, data } = await forward(USER_URL, `/permissions/${groupId}`, 'GET', auth(req));
    return reply.status(status).send(data);
  });

  app.patch('/api/permissions/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const { status, data } = await forward(USER_URL, `/permissions/${id}`, 'PATCH', auth(req), req.body);
    return reply.status(status).send(data);
  });

  app.get('/api/users/health', async (req, reply) => {
    const { status, data } = await forward(USER_URL, '/users/health', 'GET');
    return reply.status(status).send(data);
  });
};
