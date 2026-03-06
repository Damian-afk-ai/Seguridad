import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { PermissionsService } from '../../services/permissions.service';

interface MenuItem {
    label: string;
    icon: string;
    route?: string;
    children?: MenuItem[];
    expanded?: boolean;
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        ButtonModule,
        RippleModule,
        TooltipModule
    ],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.css',
})
export class Sidebar {
    isCollapsed = false;

    private router = inject(Router);
    private permissionsService = inject(PermissionsService);

    menuItems: MenuItem[] = [
        { label: 'Inicio', icon: 'pi pi-home', route: '/home' },
        {
            label: 'Gestión',
            icon: 'pi pi-sitemap',
            expanded: false,
            children: [
                { label: 'Usuario', icon: 'pi pi-user', route: '/home/users' },
                { label: 'Grupos', icon: 'pi pi-users', route: '/home/groups' },
                { label: 'Tickets', icon: 'pi pi-ticket', route: '/home/tickets' },
            ]
        }
    ];

    toggleSidebar() {
        this.isCollapsed = !this.isCollapsed;
    }

    toggleSection(item: MenuItem) {
        item.expanded = !item.expanded;
    }

    logout() {
        this.permissionsService.clearPermissions();
        this.router.navigate(['/login']);
    }
}
