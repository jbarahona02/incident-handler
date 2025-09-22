import { Routes } from "@angular/router";
import { NavItem } from "../../shared/interfaces";
import { Sidebar } from "../../shared/components/sidebar/sidebar.component";

/*ENUM que relaciona los menuOptionCode de la DB*/ 
export enum TECHNICAL_SUPPORT_PAGES {
    HOME = 'home',
    VIEW_INCIDENT = 'view-inci',
}

const adminItems: NavItem[] = [
    { 
        path: TECHNICAL_SUPPORT_PAGES.HOME, 
        label: 'Incidentes', 
        icon: 'home' 
    }
];

export const REPORTER_ROUTES: Routes = [
    {
        path: '',
        component: Sidebar,
        data: { navItems: adminItems , role : "REPORTER" }, // Pasamos los items del menú
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: TECHNICAL_SUPPORT_PAGES.HOME
            },
            {
                path: TECHNICAL_SUPPORT_PAGES.HOME,
                loadComponent: () => import('./pages/incidents/incidents.page').then(p => p.IncidentsPage)
            },
        ]
    },
    {
        path: '**',
        redirectTo: TECHNICAL_SUPPORT_PAGES.HOME
    }
];