import { Routes } from "@angular/router";
import { NavItem } from "../../shared/interfaces";
import { Sidebar } from "../../shared/components/sidebar/sidebar.component";

/*ENUM que relaciona los menuOptionCode de la DB*/ 
export enum REPORTER_PAGES {
    HOME = 'home',
    ADD_INCIDENT = 'add-incident',
}

const adminItems: NavItem[] = [
    { 
        path: REPORTER_PAGES.HOME, 
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
                redirectTo: REPORTER_PAGES.HOME
            },
            {
                path: REPORTER_PAGES.HOME,
                loadComponent: () => import('./pages/incidents/incidents.page').then(p => p.IncidentsPage)
            },
            {
                path: REPORTER_PAGES.ADD_INCIDENT,
                loadComponent: () => import('./pages/add-incident/add-incident.page').then(p => p.AddIncidentPage)
            }
        ]
    },
    {
        path: '**',
        redirectTo: REPORTER_PAGES.HOME
    }
];