import { createClient, SupabaseClient } from '@supabase/supabase-js';
import 'dotenv/config';

let instance: SupabaseClient | null = null;

/**
 * Singleton — Cliente Supabase con Service Role Key.
 * Solo el backend tiene acceso a esta clave.
 */
export function getSupabase(): SupabaseClient {
  if (!instance) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;

    if (!url || !key) {
      throw new Error('[Supabase] SUPABASE_URL y SUPABASE_SERVICE_KEY deben estar definidos en .env');
    }

    instance = createClient(url, key);
  }
  return instance;
}
