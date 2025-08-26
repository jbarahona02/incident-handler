import { Routes } from "@angular/router";
import { NavItem } from "../../shared/interfaces";
import { Sidebar } from "../../shared/components/sidebar/sidebar.component";

export enum ADMIN_PAGES {
    HOME = 'home',
    DASHBOARD = 'dashboard',
    INCIDENTES = 'incidentes',
    USUARIOS = 'usuarios'
}

const adminItems: NavItem[] = [
    { 
        path: ADMIN_PAGES.HOME, 
        label: 'Inicio', 
        icon: 'home' 
    },
    {
        path: ADMIN_PAGES.DASHBOARD,
        label: 'Dashboard',
        icon: 'check'
    }
];

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: Sidebar,
        data: { navItems: adminItems }, // Pasamos los items del menú
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: ADMIN_PAGES.HOME
            },
            {
                path: ADMIN_PAGES.HOME,
                loadComponent: () => import('./pages/home-admin/home-admin.page').then(c => c.HomeAdminPage)
            },
            {
                path: ADMIN_PAGES.DASHBOARD,
                loadComponent: () => import('./pages/opcion2-admin/opcion2-admin.page').then(c => c.Opcion2AdminPage)
            }
        ]
    },
    {
        path: '**',
        redirectTo: ADMIN_PAGES.HOME
    }
];