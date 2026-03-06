import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionsService } from '../services/permissions.service';

export const permissionGuard: CanActivateFn = (route, _state) => {
    const permissionsService = inject(PermissionsService);
    const router = inject(Router);

    // Lee el permiso requerido desde la configuración de la ruta
    const requiredPermission = route.data?.['permission'] as string | undefined;

    if (!requiredPermission) {
        console.warn('⚠️ Ruta sin permiso configurado en data.permission:', route.url);
        return true; // Sin restricción si no hay permiso definido
    }

    if (permissionsService.hasPermission(requiredPermission)) {
        return true;
    }

    console.warn(`🚫 Acceso denegado: se requiere el permiso "${requiredPermission}"`);
    router.navigate(['/home']);
    return false;
};
