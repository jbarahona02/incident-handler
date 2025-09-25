import { Routes } from "@angular/router";
import { NavItem } from "../../shared/interfaces";
import { Sidebar } from "../../shared/components/sidebar/sidebar.component";

/*ENUM que relaciona los menuOptionCode de la DB*/ 
export enum TECHNICAL_SUPPORT_PAGES {
    HOME = 'home',
    VIEW_INCIDENT = 'view-inci',
    DETAIL_INCIDENT = 'detail-incident/:id'
}

const adminItems: NavItem[] = [
    { 
        path: TECHNICAL_SUPPORT_PAGES.HOME, 
        label: 'Incidentes', 
        icon: 'home' 
    }
];

export const TECHNICAL_SUPPORT_ROUTES: Routes = [
    {
        path: '',
        component: Sidebar,
        data: { navItems: adminItems , role : "TECH" }, // Pasamos los items del menú
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: TECHNICAL_SUPPORT_PAGES.HOME
            },
            {
                path: TECHNICAL_SUPPORT_PAGES.HOME,
                loadComponent: () => import('./pages/incidents/incident-list/incident-list.page').then(p => p.IncidentListPage)
            },
            {
                path: TECHNICAL_SUPPORT_PAGES.DETAIL_INCIDENT,
                loadComponent: () => import('./pages/incidents/incident-detail/incident-detail.page').then(p => p.IncidentDetailPage)
            }
            
        ]
    },
    {
        path: '**',
        redirectTo: TECHNICAL_SUPPORT_PAGES.HOME
    }
];