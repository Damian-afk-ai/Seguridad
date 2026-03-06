import { Injectable, signal, computed } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PermissionsService {
    // Signal que almacena los permisos del usuario autenticado
    private permissions = signal<string[]>([]);

    // Signal computado de solo lectura para exponer los permisos
    readonly currentPermissions = computed(() => this.permissions());

    /** Establece los permisos del usuario (llamado después del login) */
    setPermissions(permissions: string[]): void {
        this.permissions.set(permissions);
        console.log('🔐 Permisos cargados:', permissions);
    }

    /** Verifica si el usuario tiene UN permiso específico */
    hasPermission(permission: string): boolean {
        return this.permissions().includes(permission);
    }

    /** Verifica si el usuario tiene TODOS los permisos proporcionados */
    hasAllPermissions(permissions: string[]): boolean {
        return permissions.every((p) => this.permissions().includes(p));
    }

    /** Verifica si el usuario tiene AL MENOS UNO de los permisos proporcionados */
    hasAnyPermission(permissions: string[]): boolean {
        return permissions.some((p) => this.permissions().includes(p));
    }

    /** Limpia los permisos (llamado en logout) */
    clearPermissions(): void {
        this.permissions.set([]);
        console.log('🔓 Permisos limpiados');
    }
}
