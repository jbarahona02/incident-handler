import { Routes } from "@angular/router";

export enum AUTH_PAGE {
    LOGIN = 'login',
}

export const AUTH_ROUTES : Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: AUTH_PAGE.LOGIN
            },
            {
                path: AUTH_PAGE.LOGIN,
                loadComponent: () => import('./pages/login/login.page').then(p => p.LoginPage)
            }
        ]
    },
    {
        path: '**',
        redirectTo: AUTH_PAGE.LOGIN
    }
]