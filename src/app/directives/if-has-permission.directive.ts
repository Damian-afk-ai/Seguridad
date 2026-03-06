import {
    Directive,
    Input,
    TemplateRef,
    ViewContainerRef,
    inject,
    effect,
} from '@angular/core';
import { PermissionsService } from '../services/permissions.service';

@Directive({
    selector: '[ifHasPermission]',
    standalone: true,
})
export class IfHasPermissionDirective {
    private templateRef = inject(TemplateRef<unknown>);
    private viewContainer = inject(ViewContainerRef);
    private permissionsService = inject(PermissionsService);

    private hasView = false;
    private requiredPermissions: string[] = [];

    @Input()
    set ifHasPermission(permissions: string[]) {
        this.requiredPermissions = permissions;
    }

    constructor() {
        // Reactivo: se re-evalúa cada vez que los permisos del Signal cambien
        effect(() => {
            const hasPermission = this.permissionsService.hasAnyPermission(this.requiredPermissions);

            if (hasPermission && !this.hasView) {
                this.viewContainer.createEmbeddedView(this.templateRef);
                this.hasView = true;
            } else if (!hasPermission && this.hasView) {
                this.viewContainer.clear();
                this.hasView = false;
            }
        });
    }
}
