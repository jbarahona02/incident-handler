import { Routes } from "@angular/router";
import { NavItem } from "../../shared/interfaces";
import { Sidebar } from "../../shared/components/sidebar/sidebar.component";

/*ENUM que relaciona los menuOptionCode de la DB*/ 
export enum ADMIN_PAGES {
    HOME = 'home',
    DASHBOARD = 'dashboard',
    INCIDENTES = 'incidentes',
    USERS = 'usuarios',
    ROLES = 'roles'
}

const adminItems: NavItem[] = [
    { 
        path: ADMIN_PAGES.HOME, 
        label: 'Inicio', 
        icon: 'home' 
    }
];

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: Sidebar,
        data: { navItems: adminItems , role : "ADMIN" }, // Pasamos los items del menú
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
                path: ADMIN_PAGES.ROLES,
                loadComponent: () => import('./pages/catalogs/role/role.component').then(c => c.RoleComponent)
            }
        ]
    },
    {
        path: '**',
        redirectTo: ADMIN_PAGES.HOME
    }
];