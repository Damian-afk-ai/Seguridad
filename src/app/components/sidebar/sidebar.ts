import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

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

    menuItems: MenuItem[] = [
        { label: 'Inicio', icon: 'pi pi-home', route: '/home' },
        { label: 'Dashboard', icon: 'pi pi-chart-bar', route: '/home/dashboard' },
        {
            label: 'Gestión',
            icon: 'pi pi-sitemap',
            expanded: false,
            children: [
                { label: 'Usuario', icon: 'pi pi-user', route: '/home/users' },
                { label: 'Grupos', icon: 'pi pi-users', route: '/home/groups' },
            ]
        },
        { label: 'Productos', icon: 'pi pi-box', route: '/home/products' },
        { label: 'Admin', icon: 'pi pi-cog', route: '/home/admin' },
    ];

    constructor(private router: Router) { }

    toggleSidebar() {
        this.isCollapsed = !this.isCollapsed;
    }

    toggleSection(item: MenuItem) {
        item.expanded = !item.expanded;
    }

    logout() {
        this.router.navigate(['/login']);
    }
}
