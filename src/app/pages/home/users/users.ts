import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { IfHasPermissionDirective } from '../../../directives/if-has-permission.directive';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        FloatLabelModule,
        DividerModule,
        TagModule,
        ToastModule,
        ConfirmDialogModule,
        AvatarModule,
        IfHasPermissionDirective,
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './users.html',
    styleUrl: './users.css',
})
export class Users {
    // Datos estáticos del administrador
    admin = {
        nombre: 'Administrador',
        email: 'admin@correo.com',
        password: 'Seguridad1!',
        telefono: '6141234567',
        rol: 'Administrador',
    };

    isEditing = false;
    dadoDeBaja = false;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    toggleEdit() {
        this.isEditing = !this.isEditing;
    }

    saveChanges() {
        this.isEditing = false;
        this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: 'Los cambios se guardaron correctamente.',
        });
    }

    cancelEdit() {
        // Restaurar datos originales
        this.admin = {
            nombre: 'Administrador',
            email: 'admin@correo.com',
            password: 'Seguridad1!',
            telefono: '6141234567',
            rol: 'Administrador',
        };
        this.isEditing = false;
        this.messageService.add({
            severity: 'info',
            summary: 'Cancelado',
            detail: 'Los cambios fueron descartados.',
        });
    }

    /** Simula dar de baja / reactivar al usuario */
    darDeBaja() {
        if (this.dadoDeBaja) {
            // Reactivar
            this.dadoDeBaja = false;
            this.messageService.add({
                severity: 'success',
                summary: 'Reactivado',
                detail: 'La cuenta fue reactivada exitosamente.',
            });
            return;
        }

        this.confirmationService.confirm({
            message: '¿Estás seguro de que deseas dar de baja esta cuenta? El usuario perderá acceso al sistema.',
            header: 'Confirmar baja de cuenta',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, dar de baja',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.dadoDeBaja = true;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Cuenta dada de baja',
                    detail: 'La cuenta ha sido desactivada correctamente.',
                });
            },
        });
    }
}
