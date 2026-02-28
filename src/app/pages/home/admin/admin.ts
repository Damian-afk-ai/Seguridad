import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, CardModule, TableModule, TagModule],
    templateUrl: './admin.html',
    styleUrl: './admin.css',
})
export class Admin {
    systemInfo = [
        { label: 'Versión del sistema', value: 'v0.0.5', icon: 'pi pi-tag' },
        { label: 'Último despliegue', value: '27/Feb/2026', icon: 'pi pi-calendar' },
        { label: 'Usuarios activos', value: '24', icon: 'pi pi-users' },
        { label: 'Tiempo activo', value: '99.8%', icon: 'pi pi-check-circle' },
    ];

    logs = [
        { time: '19:30', action: 'Login exitoso', user: 'Carlos Martínez', type: 'info' },
        { time: '19:25', action: 'Producto actualizado', user: 'Ana López', type: 'warning' },
        { time: '19:10', action: 'Nuevo usuario registrado', user: 'Sistema', type: 'success' },
        { time: '18:45', action: 'Intento de acceso fallido', user: 'Desconocido', type: 'error' },
        { time: '18:30', action: 'Backup completado', user: 'Sistema', type: 'info' },
    ];

    getSeverity(type: string): 'info' | 'success' | 'warn' | 'danger' {
        const map: Record<string, 'info' | 'success' | 'warn' | 'danger'> = {
            info: 'info',
            success: 'success',
            warning: 'warn',
            error: 'danger',
        };
        return map[type] || 'info';
    }
}
