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
import { MessageService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';

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
        AvatarModule,
    ],
    providers: [MessageService],
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

    constructor(private messageService: MessageService) { }

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
}
