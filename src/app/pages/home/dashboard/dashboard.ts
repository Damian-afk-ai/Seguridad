import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, CardModule, TagModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css',
})
export class Dashboard {
    cards = [
        {
            title: 'Total Proyectos',
            value: 12,
            icon: 'pi pi-folder',
            severity: 'info' as const,
        },
        {
            title: 'Avance General',
            value: '78%',
            icon: 'pi pi-chart-line',
            severity: 'success' as const,
        },
    ];
}
