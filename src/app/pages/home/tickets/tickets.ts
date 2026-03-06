import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { IfHasPermissionDirective } from '../../../directives/if-has-permission.directive';

interface Ticket {
    id: number;
    asunto: string;
    estado: 'Abierto' | 'En Progreso' | 'Cerrado';
}

@Component({
    selector: 'app-tickets',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        TableModule,
        ButtonModule,
        TagModule,
        ToastModule,
        TooltipModule,
        IfHasPermissionDirective,
    ],
    providers: [MessageService],
    templateUrl: './tickets.html',
    styleUrl: './tickets.css',
})
export class Tickets {
    // ============ Datos estáticos ============
    tickets: Ticket[] = [
        { id: 1, asunto: 'Error en el inicio de sesión', estado: 'Abierto' },
        { id: 2, asunto: 'Solicitud de nueva funcionalidad', estado: 'En Progreso' },
        { id: 3, asunto: 'Problema con permisos de usuario', estado: 'Abierto' },
        { id: 4, asunto: 'Actualización de contraseña fallida', estado: 'Cerrado' },
        { id: 5, asunto: 'Error al exportar reporte', estado: 'En Progreso' },
    ];

    private nextId = 6;

    constructor(private messageService: MessageService) { }

    getStatusSeverity(estado: string): 'success' | 'warn' | 'danger' | 'info' {
        switch (estado) {
            case 'Abierto':
                return 'info';
            case 'En Progreso':
                return 'warn';
            case 'Cerrado':
                return 'success';
            default:
                return 'info';
        }
    }

    getStatusIcon(estado: string): string {
        switch (estado) {
            case 'Abierto':
                return 'pi pi-folder-open';
            case 'En Progreso':
                return 'pi pi-spin pi-spinner';
            case 'Cerrado':
                return 'pi pi-check-circle';
            default:
                return 'pi pi-info-circle';
        }
    }

    crearTicket() {
        const nuevo: Ticket = {
            id: this.nextId++,
            asunto: `Nuevo ticket #${this.nextId - 1}`,
            estado: 'Abierto',
        };
        this.tickets = [...this.tickets, nuevo];
        this.messageService.add({
            severity: 'success',
            summary: 'Ticket creado',
            detail: `Se creó el ticket "${nuevo.asunto}".`,
        });
    }

    editarTicket(ticket: Ticket) {
        this.messageService.add({
            severity: 'info',
            summary: 'Editar ticket',
            detail: `Editando ticket #${ticket.id}: "${ticket.asunto}".`,
        });
    }

    eliminarTicket(ticket: Ticket) {
        this.tickets = this.tickets.filter((t) => t.id !== ticket.id);
        this.messageService.add({
            severity: 'error',
            summary: 'Ticket eliminado',
            detail: `El ticket #${ticket.id} fue eliminado.`,
        });
    }
}
