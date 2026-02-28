import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/home/dashboard/dashboard';
import { Products } from './pages/home/products/products';
import { Users } from './pages/home/users/users';
import { Groups } from './pages/home/groups/groups';
import { Admin } from './pages/home/admin/admin';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    {
        path: 'home',
        component: MainLayout,
        children: [
            { path: '', component: Home },
            { path: 'dashboard', component: Dashboard },
            { path: 'products', component: Products },
            { path: 'users', component: Users },
            { path: 'groups', component: Groups },
            { path: 'admin', component: Admin },
        ]
    },
];
