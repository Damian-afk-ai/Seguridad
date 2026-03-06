import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { Users } from './pages/home/users/users';
import { Groups } from './pages/home/groups/groups';
import { Tickets } from './pages/home/tickets/tickets';
import { permissionGuard } from './guards/permission.guard';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    {
        path: 'home',
        component: MainLayout,
        children: [
            { path: '', component: Home },
            {
                path: 'users',
                component: Users,
                canActivate: [permissionGuard],
                data: { permission: 'users_view' }
            },
            {
                path: 'groups',
                component: Groups,
                canActivate: [permissionGuard],
                data: { permission: 'groups_view' }
            },
            {
                path: 'tickets',
                component: Tickets,
                canActivate: [permissionGuard],
                data: { permission: 'tickets_view' }
            }
        ]
    },
];
