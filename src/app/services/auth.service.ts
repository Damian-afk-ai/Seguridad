import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import type { ApiResponse } from '../models/api-response.model';

// ── Catálogo de permisos ─────────────────────────────────────────────────────
export const ALL_PERMISSIONS = [
    'group:create', 'group:edit', 'group:delete', 'group:view', 'group:add',
    'group:add_member', 'group:remove_member',
    'ticket:create', 'ticket:edit', 'ticket:delete', 'ticket:view', 'ticket:add',
    'ticket:assign', 'ticket:change_status', 'ticket:edit_state', 'ticket:comment',
    'user:create', 'user:edit', 'user:add', 'user:delete', 'user:view',
    'users:view', 'user:manage_permissions',
] as const;

export type Permission = typeof ALL_PERMISSIONS[number];

export interface AppUser {
    id: string;
    username: string;
    email: string;
    fullName: string;
    puesto?: string;
    groupId?: string;
    permissions?: Permission[];
}

/** Fila de la tabla public.users — esquema real */
export interface DbUser {
    id: string;
    full_name: string;
    email: string;
    group_id: string | null;
    puesto: string | null;
}

/** Fila de la tabla public.permissions */
export interface DbPermission {
    id?: string;
    group_id: string;
    resource: string;
    can_view: boolean;
    can_create: boolean;
    can_edit: boolean;
    can_delete: boolean;
}

/** Fila de la tabla public.groups */
export interface DbGroup {
    id: string;
    name: string;
    description: string | null;
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function opCode(resource: string, status: number): string {
    const tag = resource.substring(0, 2).toUpperCase();
    return `Sx${tag}${status}`;
}

function respond<T>(statusCode: number, resource: string, data: T): ApiResponse<T> {
    return { statusCode, intOpCode: opCode(resource, statusCode), data };
}

/** Clave para guardar JWT en localStorage */
const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
    /** Usuario reactivo actual (null = no autenticado) */
    currentUser = signal<AppUser | null>(null);

    private http = inject(HttpClient);
    private api = environment.apiUrl;

    constructor() {
        // Restaurar sesión si hay token guardado
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            this.restoreSession();
        }
    }

    // ── Restaurar sesión desde JWT guardado ─────────────────────────────────────
    private async restoreSession(): Promise<void> {
        try {
            const res = await firstValueFrom(
                this.http.get<ApiResponse<any>>(`${this.api}/auth/session`)
            );
            if (res.statusCode === 200 && res.data) {
                this.currentUser.set({
                    id: res.data.id,
                    email: res.data.email,
                    fullName: res.data.fullName,
                    username: res.data.username ?? res.data.email,
                    puesto: res.data.puesto ?? undefined,
                    groupId: res.data.groupId ?? undefined,
                    permissions: res.data.permissions ?? [],
                });
            }
        } catch {
            // Token inválido/expirado → limpiar
            localStorage.removeItem(TOKEN_KEY);
            this.currentUser.set(null);
        }
    }

    // ── Login con email + password ──────────────────────────────────────────────
    async login(email: string, password: string): Promise<ApiResponse<AppUser | null>> {
        try {
            const res = await firstValueFrom(
                this.http.post<ApiResponse<any>>(`${this.api}/auth/login`, { email, password })
            );

            if (res.statusCode === 200 && res.data) {
                // Guardar JWT del backend
                localStorage.setItem(TOKEN_KEY, res.data.token);

                const user: AppUser = {
                    id: res.data.user.id,
                    email: res.data.user.email,
                    fullName: res.data.user.fullName,
                    username: res.data.user.username ?? res.data.user.email,
                    puesto: res.data.user.puesto ?? undefined,
                    groupId: res.data.user.groupId ?? undefined,
                    permissions: res.data.user.permissions ?? [],
                };

                this.currentUser.set(user);
                return respond(200, 'users', user);
            }

            return respond(res.statusCode, 'users', null);
        } catch (err: any) {
            const status = err?.status ?? 500;
            return respond(status, 'users', null);
        }
    }

    // ── Registro de nuevo usuario ───────────────────────────────────────────────
    async register(
        email: string,
        password: string,
        fullName: string,
        username: string
    ): Promise<ApiResponse<{ userId: string } | null>> {
        try {
            const res = await firstValueFrom(
                this.http.post<ApiResponse<any>>(`${this.api}/auth/register`, {
                    email, password, fullName, username,
                })
            );

            if (res.statusCode === 201 && res.data) {
                return respond(201, 'users', { userId: res.data.userId });
            }

            return respond(res.statusCode, 'users', null);
        } catch (err: any) {
            const status = err?.status ?? 500;
            return respond(status, 'users', null);
        }
    }

    // ── Logout ──────────────────────────────────────────────────────────────────
    async logout(): Promise<void> {
        localStorage.removeItem(TOKEN_KEY);
        this.currentUser.set(null);
    }

    isLoggedIn(): boolean {
        return this.currentUser() !== null;
    }

    // ── Obtener todos los usuarios ──────────────────────────────────────────────
    async getUsers(): Promise<ApiResponse<DbUser[] | null>> {
        try {
            const res = await firstValueFrom(
                this.http.get<ApiResponse<DbUser[]>>(`${this.api}/users`)
            );
            return respond(200, 'users', res.data ?? []);
        } catch {
            return respond(500, 'users', null);
        }
    }

    // ── Obtener todos los grupos ────────────────────────────────────────────────
    async getGroups(): Promise<ApiResponse<DbGroup[] | null>> {
        try {
            const res = await firstValueFrom(
                this.http.get<ApiResponse<DbGroup[]>>(`${this.api}/groups`)
            );
            return respond(200, 'groups', res.data ?? []);
        } catch {
            return respond(500, 'groups', null);
        }
    }

    // ── Actualizar group_id de un usuario ──────────────────────────────────────
    async updateUserGroup(userId: string, groupId: string | null): Promise<ApiResponse<null>> {
        try {
            await firstValueFrom(
                this.http.patch<ApiResponse<any>>(`${this.api}/users/${userId}`, { group_id: groupId })
            );
            return respond(200, 'users', null);
        } catch {
            return respond(500, 'users', null);
        }
    }

    // ── Actualizar datos completos de un usuario ────────────────────────────────
    async updateUser(
        userId: string,
        payload: Partial<Pick<DbUser, 'full_name' | 'group_id' | 'puesto'>>
    ): Promise<ApiResponse<DbUser | null>> {
        try {
            const res = await firstValueFrom(
                this.http.patch<ApiResponse<DbUser>>(`${this.api}/users/${userId}`, payload)
            );
            return respond(200, 'users', res.data ?? null);
        } catch {
            return respond(500, 'users', null);
        }
    }

    // ── Obtener permisos de un grupo ─────────────────────────────────────────────
    async getGroupPermissions(groupId: string): Promise<ApiResponse<DbPermission[] | null>> {
        try {
            const res = await firstValueFrom(
                this.http.get<ApiResponse<DbPermission[]>>(`${this.api}/permissions/${groupId}`)
            );
            return respond(200, 'permissions', res.data ?? []);
        } catch {
            return respond(500, 'permissions', null);
        }
    }

    // ── Actualizar un permiso (toggle individual) ───────────────────────────────
    async updatePermission(
        permissionId: string,
        changes: Partial<Pick<DbPermission, 'can_view' | 'can_create' | 'can_edit' | 'can_delete'>>
    ): Promise<ApiResponse<null>> {
        try {
            await firstValueFrom(
                this.http.patch<ApiResponse<null>>(`${this.api}/permissions/${permissionId}`, changes)
            );
            return respond(200, 'permissions', null);
        } catch {
            return respond(500, 'permissions', null);
        }
    }

    // ── Crear o actualizar fila de permiso para un grupo + recurso ───────────
    async upsertPermission(
        groupId: string,
        resource: string,
        perms: { can_view: boolean; can_create: boolean; can_edit: boolean; can_delete: boolean }
    ): Promise<ApiResponse<DbPermission | null>> {
        // upsert no existe directo en el backend, usar update del permiso existente
        // o implementar en user-service si necesario
        try {
            const existing = await this.getGroupPermissions(groupId);
            const row = existing.data?.find(p => p.resource === resource);

            if (row && row.id) {
                await this.updatePermission(row.id, perms);
                return respond(200, 'permissions', { ...row, ...perms });
            }

            return respond(500, 'permissions', null);
        } catch {
            return respond(500, 'permissions', null);
        }
    }

    // ── Eliminar usuario ────────────────────────────────────────────────────────
    async deleteUser(userId: string): Promise<ApiResponse<null>> {
        try {
            await firstValueFrom(
                this.http.delete<ApiResponse<null>>(`${this.api}/users/${userId}`)
            );
            return respond(200, 'users', null);
        } catch {
            return respond(500, 'users', null);
        }
    }
}