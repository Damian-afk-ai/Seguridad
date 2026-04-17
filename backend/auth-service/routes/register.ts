import { FastifyPluginAsync } from 'fastify';
import { getSupabase } from '../../shared/supabase.js';
import { respond } from '../../shared/response.js';

const SERVICE = 'auth-service';

export const registerRoute: FastifyPluginAsync = async (app) => {
  app.post('/register', async (request, reply) => {
    const { email, password, fullName, username } = request.body as {
      email: string;
      password: string;
      fullName: string;
      username: string;
    };

    const sb = getSupabase();

    // 1. Crear cuenta en Supabase Auth
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, username } },
    });

    if (error) {
      return reply.status(400).send(respond(400, SERVICE, 'users', { message: error.message }));
    }

    // 2. Insertar fila en tabla pública users
    if (data.user) {
      const { error: insertError } = await sb.from('users').insert({
        id: data.user.id,
        email,
        full_name: fullName,
      });

      if (insertError) {
        console.warn('[Auth Service] Error insertando perfil en users:', insertError.message);
      }
    }

    return reply.status(201).send(
      respond(201, SERVICE, 'users', { userId: data.user?.id ?? '' })
    );
  });
};
