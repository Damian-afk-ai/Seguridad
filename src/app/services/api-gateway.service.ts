import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { AuthService, Permission } from './auth.service';
import { PermissionService } from './permission.service';
import type { ApiResponse } from '../models/api-response.model';
import type { PostgrestError } from '@supabase/supabase-js';

/**
 * Capa lógica de "API Gateway" en el frontend.
 *
 * Antes de ejecutar cualquier operación contra Supabase, valida:
 *   1. Que exista sesión activa (token).
 *   2. Que el usuario posea el permiso requerido para la acción.
 *
 * Todas las respuestas se envuelven en el formato estándar ApiResponse.
 */
@Injectable({ providedIn: 'root' })
export class ApiGatewayService {
  private sb = inject(SupabaseService);
  private auth = inject(AuthService);
  private permissions = inject(PermissionService);
  private router = inject(Router);

  // ─────────────────────────────────────────────────────────────────────────────
  // Helpers internos
  // ─────────────────────────────────────────────────────────────────────────────

  /** Genera intOpCode: prefijo + recurso abreviado + statusCode */
  private opCode(prefix: string, resource: string, status: number): string {
    const tag = resource.substring(0, 2).toUpperCase();
    return `${prefix}${tag}${status}`;
  }

  /** Respuesta estándar rápida */
  private respond<T>(statusCode: number, intOpCode: string, data: T): ApiResponse<T> {
    return { statusCode, intOpCode, data };
  }

  /** Comprobación previa de autenticación + permiso */
  private preCheck(requiredPermission: string, resource: string): ApiResponse | null {
    if (!this.auth.isLoggedIn()) {
      return this.respond(401, this.opCode('Sx', resource, 401), null);
    }
    if (!this.permissions.hasPermission(requiredPermission)) {
      return this.respond(403, this.opCode('Sx', resource, 403), null);
    }
    return null; // todo ok
  }

  /**
   * Manejo centralizado de errores Supabase.
   * - 401 / PGRST301 → sesión expirada → logout + redirect
   * - 429 → Rate limit alcanzado → log + aviso
   * - Otros → error genérico 500
   */
  private handleError(error: PostgrestError | null, resource: string): ApiResponse<null> | null {
    if (!error) return null;

    const msg = error.message?.toLowerCase() ?? '';
    const code = error.code ?? '';

    // JWT expired o sesión inválida
    if (code === 'PGRST301' || msg.includes('jwt expired') || msg.includes('invalid token')) {
      console.warn('[ApiGateway] 401 — Token expirado. Cerrando sesión...');
      this.auth.logout();
      this.router.navigate(['/auth/login']);
      return this.respond(401, this.opCode('Sx', resource, 401), null);
    }

    // Rate limit — HTTP 429 o Trigger PostgreSQL (P0001 + hint rate_limit)
    if (code === '429' || code === 'P0001' || msg.includes('rate limit') || msg.includes('too many requests')) {
      console.error('[ApiGateway] 429 — Rate limit excedido:', error.message);
      return this.respond(429, this.opCode('Sx', resource, 429), null);
    }

    // Error genérico
    console.error(`[ApiGateway] Error en ${resource}:`, error.message);
    return this.respond(500, this.opCode('Sx', resource, 500), null);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CRUD genérico
  // ─────────────────────────────────────────────────────────────────────────────

  /** SELECT con validación de viewer permission */
  async query<T = any>(
    table: string,
    permission: string,
    selectColumns = '*',
    filters?: Record<string, any>
  ): Promise<ApiResponse<T[] | null>> {
    const resource = table;
    const blocked = this.preCheck(permission, resource);
    if (blocked) return blocked as ApiResponse<null>;

    let query = this.sb.client.from(table).select(selectColumns);

    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        query = query.eq(key, value);
      }
    }

    const { data, error } = await query;

    if (error) {
      return this.handleError(error, resource) as ApiResponse<null>;
    }

    return this.respond(200, this.opCode('Sx', resource, 200), data as T[]);
  }

  /** INSERT con validación de creator permission */
  async insert<T = any>(
    table: string,
    permission: string,
    payload: Record<string, any>
  ): Promise<ApiResponse<T | null>> {
    const resource = table;
    const blocked = this.preCheck(permission, resource);
    if (blocked) return blocked as ApiResponse<null>;

    const { data, error } = await this.sb.client
      .from(table)
      .insert(payload)
      .select()
      .single();

    if (error) {
      return this.handleError(error, resource) as ApiResponse<null>;
    }

    return this.respond(201, this.opCode('Sx', resource, 201), data as T);
  }

  /** UPDATE con validación de editor permission */
  async update<T = any>(
    table: string,
    permission: string,
    id: string,
    payload: Record<string, any>
  ): Promise<ApiResponse<T | null>> {
    const resource = table;
    const blocked = this.preCheck(permission, resource);
    if (blocked) return blocked as ApiResponse<null>;

    const { data, error } = await this.sb.client
      .from(table)
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return this.handleError(error, resource) as ApiResponse<null>;
    }

    return this.respond(200, this.opCode('Sx', resource, 200), data as T);
  }

  /** DELETE con validación de delete permission */
  async delete(
    table: string,
    permission: string,
    id: string
  ): Promise<ApiResponse<null>> {
    const resource = table;
    const blocked = this.preCheck(permission, resource);
    if (blocked) return blocked as ApiResponse<null>;

    const { error } = await this.sb.client
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      return this.handleError(error, resource) as ApiResponse<null>;
    }

    return this.respond(200, this.opCode('Sx', resource, 200), null);
  }

  /**
   * Health Check API (Tipo GET)
   * Verifica la conectividad o estado del servicio.
   */
  async health(): Promise<ApiResponse<string>> {
    // Realizamos un ping sencillo a Supabase para comprobar conexión
    const { error } = await this.sb.client.auth.getSession();

    if (error) {
      return this.respond(503, this.opCode('Sx', 'he', 503), 'Service Unavailable');
    }

    return this.respond(200, this.opCode('Sx', 'he', 200), 'OK');
  }
}
