import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink, CardModule, ButtonModule],
    templateUrl: './home.html',
    styleUrl: './home.css',
})
export class Home {
    quickLinks = [
        { label: 'Usuario', icon: 'pi pi-user', route: '/home/users' },
        { label: 'Grupos', icon: 'pi pi-users', route: '/home/groups' }
    ];
}
