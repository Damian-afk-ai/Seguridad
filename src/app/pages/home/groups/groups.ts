import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-groups',
    standalone: true,
    imports: [CommonModule, CardModule, AvatarModule, TagModule, DividerModule],
    templateUrl: './groups.html',
    styleUrl: './groups.css',
})
export class Groups {
    groups = [
        { id: 1, name: 'Administradores', members: 3, description: 'Acceso total al sistema', icon: 'pi pi-shield' },
        { id: 2, name: 'Editores', members: 5, description: 'Pueden crear y editar contenido', icon: 'pi pi-pencil' },
        { id: 3, name: 'Viewers', members: 12, description: 'Solo lectura', icon: 'pi pi-eye' },
        { id: 4, name: 'Soporte', members: 4, description: 'Atención a incidencias', icon: 'pi pi-headphones' },
    ];
}
