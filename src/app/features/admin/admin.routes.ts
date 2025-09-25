import { Routes } from "@angular/router";
import { NavItem } from "../../shared/interfaces";
import { Sidebar } from "../../shared/components/sidebar/sidebar.component";

/*ENUM que relaciona los menuOptionCode de la DB*/ 
export enum ADMIN_PAGES {
    HOME = 'home',
    USERS = 'users',
    ROLES = 'roles',
    USER_TYPES = 'user-types',
    INCIDENT_TYPES = 'inci-types',
    INCIDENT_PRIORITY_LEVEL = 'inci-level',
    LOCATION = 'location',
    EQUIPMENT_TYPE = 'equi-type',
    EQUIPMENT = 'equipment',
    INCIDENT_DETAIL = "incident-detail/:id"
}

const adminItems: NavItem[] = [
    { 
        path: ADMIN_PAGES.HOME, 
        label: 'Incidentes', 
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
                loadComponent: () => import('./pages/incidents/incident-list/incident-list.page').then(p => p.IncidentListPage)
            },
            {
                path: ADMIN_PAGES.ROLES,
                loadComponent: () => import('./pages/catalogs/role/role.page').then(p => p.RolePage)
            },
            {
                path: ADMIN_PAGES.USER_TYPES,
                loadComponent: () => import('./pages/catalogs/user-type/user-type.page').then(p => p.UserTypePage)
            },
            {
                path: ADMIN_PAGES.INCIDENT_TYPES,
                loadComponent: () => import('./pages/catalogs/incident-type/incident-type.page').then(p => p.IncidentTypePage)
            }, 
            {
                path: ADMIN_PAGES.INCIDENT_PRIORITY_LEVEL,
                loadComponent: () => import('./pages/catalogs/incident-priority-level/incident-priority-level.page').then(p => p.IncidentPriorityLevelPage)
            },
            {
                path: ADMIN_PAGES.USERS,
                loadComponent: () => import('./pages/catalogs/user/user.component').then(p => p.UserPage)
            },
            {
                path: ADMIN_PAGES.LOCATION,
                loadComponent: () => import('./pages/catalogs/equipment-location/equipment-location.page').then(p => p.EquipmentLocationPage)
            },
            {
                path: ADMIN_PAGES.EQUIPMENT_TYPE,
                loadComponent: () => import('./pages/catalogs/equipment-type/equipment-type.page').then(p => p.EquipmentTypePage)
            },
            {
                path: ADMIN_PAGES.EQUIPMENT,
                loadComponent: () => import('./pages/catalogs/equipment/equipment.page').then(p => p.EquipmentPage)
            },
            {
                path: ADMIN_PAGES.INCIDENT_DETAIL,
                loadComponent: () => import('./pages/incidents/incident-detail/incident-detail.page').then(p => p.IncidentDetailPage)
            }
        ]
    },
    {
        path: '**',
        redirectTo: ADMIN_PAGES.HOME
    }
];