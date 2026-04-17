import { FastifyPluginAsync } from 'fastify';
import { respond } from '../../shared/response.js';

export const healthRoute: FastifyPluginAsync = async (app) => {
  app.get('/health', async () => {
    return respond(200, 'ticket-service', 'health', 'OK');
  });
};
