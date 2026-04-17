import { Injectable, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { AuthService, Permission } from './auth.service';
import type { ApiResponse } from '../models/api-response.model';

/**
 * PermissionService — Core de Seguridad (Frontend)
 *
 * Servicio centralizado que gestiona la autorización granular del usuario.
 * Expone:
 *   • hasPermission(permission: string): boolean
 *   • refreshPermissionsForGroup(groupId: string): void
 *
 * Se alimenta del `currentUser` Signal del AuthService, garantizando
 * reactividad total y compatibilidad con la directiva `appHasPermission`.
 */
@Injectable({ providedIn: 'root' })
export class PermissionService {
  private auth = inject(AuthService);
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  // ── Signal derivada: lista de permisos actuales ─────────────────────────────
  /**
   * Computed signal que siempre refleja los permisos del usuario actual.
   * Cualquier UI enlazada a esta señal se actualiza automáticamente al cambiar
   * el usuario o al refrescar permisos.
   */
  readonly permissions = computed<Permission[]>(() => {
    return this.auth.currentUser()?.permissions ?? [];
  });

  /**
   * Computed signal que expone el groupId del usuario autenticado.
   */
  readonly currentGroupId = computed<string | undefined>(() => {
    return this.auth.currentUser()?.groupId;
  });

  // ── API pública ─────────────────────────────────────────────────────────────

  /**
   * Comprueba si el usuario posee un permiso concreto.
   *
   * @param permission  cadena con formato "resource:action"
   *                    (ej: "tickets:add", "tickets:move", "user:view").
   * @returns `true` si el permiso existe en el array del usuario.
   *
   * Nota: la comparación es case-sensitive para evitar falsos positivos.
   */
  hasPermission(permission: string): boolean {
    const user = this.auth.currentUser();
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission as Permission);
  }

  /**
   * Comprueba si el usuario posee TODOS los permisos indicados.
   *
   * @param permissions  lista de cadenas "resource:action".
   * @returns `true` solo si TODOS los permisos del array están presentes.
   */
  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(p => this.hasPermission(p));
  }

  /**
   * Comprueba si el usuario posee AL MENOS UNO de los permisos indicados.
   *
   * @param permissions  lista de cadenas "resource:action".
   * @returns `true` si al menos un permiso coincide.
   */
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(p => this.hasPermission(p));
  }

  // ── Refresco manual de permisos ─────────────────────────────────────────────

  /**
   * Recarga los permisos desde el backend para un grupo determinado y actualiza
   * el Signal `currentUser` del AuthService, propagando la reactividad a toda
   * la UI (directivas, guards, templates, etc.).
   *
   * @param groupId  UUID del grupo cuyos permisos se consultarán.
   */
  async refreshPermissionsForGroup(groupId: string): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<ApiResponse<any[]>>(`${this.api}/permissions/${groupId}`)
      );

      if (!res.data) {
        console.error('[PermissionService] Sin datos al refrescar permisos');
        return;
      }

      const newPermissions = this.mapPermissions(res.data);

      // Actualizar el signal del AuthService (inmutably)
      const currentUser = this.auth.currentUser();
      if (currentUser) {
        this.auth.currentUser.set({
          ...currentUser,
          permissions: newPermissions,
        });
      }
    } catch (err: any) {
      console.error('[PermissionService] Error al refrescar permisos:', err.message);
    }
  }

  // ── Mapeo de filas de la tabla `permissions` a Permission[] ────────────────
  private mapPermissions(rows: any[]): Permission[] {
    const result: Permission[] = [];
    for (const row of rows) {
      const r = row.resource as string;
      if (row.can_view)   result.push(`${r}:view`   as Permission);
      if (row.can_create) result.push(`${r}:create` as Permission);
      if (row.can_edit)   result.push(`${r}:edit`    as Permission);
      if (row.can_delete) result.push(`${r}:delete`  as Permission);
    }
    return result;
  }
}
