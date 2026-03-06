import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { IfHasPermissionDirective } from '../../../directives/if-has-permission.directive';

interface Group {
    id: number;
    name: string;
    description: string;
    members: number;
    icon: string;
    status: 'Activo' | 'Inactivo';
}

@Component({
    selector: 'app-groups',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CardModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        FloatLabelModule,
        TagModule,
        ToastModule,
        ConfirmDialogModule,
        TextareaModule,
        TooltipModule,
        IconFieldModule,
        InputIconModule,
        IfHasPermissionDirective,
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './groups.html',
    styleUrl: './groups.css',
})
export class Groups {
    // ============ Datos estáticos ============
    groups: Group[] = [
        { id: 1, name: 'Administradores', description: 'Acceso total al sistema', members: 3, icon: 'pi pi-shield', status: 'Activo' },
        { id: 2, name: 'Editores', description: 'Pueden crear y editar contenido', members: 5, icon: 'pi pi-pencil', status: 'Activo' },
        { id: 3, name: 'Viewers', description: 'Solo lectura', members: 12, icon: 'pi pi-eye', status: 'Activo' },
        { id: 4, name: 'Soporte', description: 'Atención a incidencias', members: 4, icon: 'pi pi-headphones', status: 'Inactivo' },
        { id: 5, name: 'Desarrollo', description: 'Equipo de desarrollo de software', members: 8, icon: 'pi pi-code', status: 'Activo' },
        { id: 6, name: 'QA', description: 'Control de calidad y pruebas', members: 3, icon: 'pi pi-check-circle', status: 'Activo' },
    ];

    // ============ Estado del modal ============
    showDialog = false;
    isEditing = false;
    searchQuery = '';

    // Modelo del formulario
    selectedGroup: Group = this.emptyGroup();

    // Contador para IDs
    private nextId = 7;

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    // ============ Filtro de búsqueda ============
    get filteredGroups(): Group[] {
        if (!this.searchQuery.trim()) {
            return this.groups;
        }
        const query = this.searchQuery.toLowerCase();
        return this.groups.filter(
            (g) =>
                g.name.toLowerCase().includes(query) ||
                g.description.toLowerCase().includes(query)
        );
    }

    // ============ CRUD Simulado ============

    /** Abre el modal para agregar un nuevo grupo */
    openAddDialog() {
        this.selectedGroup = this.emptyGroup();
        this.isEditing = false;
        this.showDialog = true;
    }

    /** Abre el modal para editar un grupo existente */
    openEditDialog(group: Group) {
        this.selectedGroup = { ...group };
        this.isEditing = true;
        this.showDialog = true;
    }

    /** Guarda el grupo (crear o actualizar) */
    saveGroup() {
        // Validación simple
        if (!this.selectedGroup.name.trim() || !this.selectedGroup.description.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validación',
                detail: 'El nombre y la descripción son obligatorios.',
            });
            return;
        }

        if (this.isEditing) {
            // Actualizar grupo existente
            const index = this.groups.findIndex((g) => g.id === this.selectedGroup.id);
            if (index !== -1) {
                this.groups[index] = { ...this.selectedGroup };
            }
            this.messageService.add({
                severity: 'success',
                summary: 'Actualizado',
                detail: `El grupo "${this.selectedGroup.name}" fue actualizado correctamente.`,
            });
        } else {
            // Crear nuevo grupo
            this.selectedGroup.id = this.nextId++;
            this.groups.push({ ...this.selectedGroup });
            this.messageService.add({
                severity: 'success',
                summary: 'Creado',
                detail: `El grupo "${this.selectedGroup.name}" fue creado correctamente.`,
            });
        }

        this.showDialog = false;
    }

    /** Confirma y elimina un grupo */
    confirmDelete(group: Group) {
        this.confirmationService.confirm({
            message: `¿Estás seguro de que deseas eliminar el grupo "${group.name}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.groups = this.groups.filter((g) => g.id !== group.id);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Eliminado',
                    detail: `El grupo "${group.name}" fue eliminado.`,
                });
            },
        });
    }

    /** Alterna el estado del grupo */
    toggleStatus(group: Group) {
        group.status = group.status === 'Activo' ? 'Inactivo' : 'Activo';
        this.messageService.add({
            severity: 'info',
            summary: 'Estado cambiado',
            detail: `El grupo "${group.name}" ahora está ${group.status}.`,
        });
    }

    /** Cierra el modal */
    closeDialog() {
        this.showDialog = false;
    }

    // ============ Helpers ============

    private emptyGroup(): Group {
        return {
            id: 0,
            name: '',
            description: '',
            members: 0,
            icon: 'pi pi-users',
            status: 'Activo',
        };
    }

    getStatusSeverity(status: string): 'success' | 'danger' {
        return status === 'Activo' ? 'success' : 'danger';
    }

    /** Lista de iconos disponibles para seleccionar */
    availableIcons = [
        'pi pi-shield',
        'pi pi-pencil',
        'pi pi-eye',
        'pi pi-headphones',
        'pi pi-code',
        'pi pi-check-circle',
        'pi pi-users',
        'pi pi-cog',
        'pi pi-database',
        'pi pi-lock',
        'pi pi-globe',
        'pi pi-star',
    ];

    selectIcon(icon: string) {
        this.selectedGroup.icon = icon;
    }
}
