import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule, TableModule, TagModule, CardModule],
    templateUrl: './products.html',
    styleUrl: './products.css',
})
export class Products {
    products = [
        { id: 1, name: 'Servidor Cloud Básico', category: 'Infraestructura', status: 'Activo', price: '$120/mes' },
        { id: 2, name: 'Firewall Avanzado', category: 'Seguridad', status: 'Activo', price: '$85/mes' },
        { id: 3, name: 'VPN Empresarial', category: 'Red', status: 'Inactivo', price: '$45/mes' },
        { id: 4, name: 'Certificado SSL', category: 'Seguridad', status: 'Activo', price: '$30/año' },
        { id: 5, name: 'Backup Automático', category: 'Almacenamiento', status: 'Activo', price: '$60/mes' },
    ];

    getSeverity(status: string): 'success' | 'danger' {
        return status === 'Activo' ? 'success' : 'danger';
    }
}
