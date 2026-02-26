import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    {
        path: 'home',
        component: MainLayout,
        children: [
            { path: '', component: Home },
        ]
    },
];
