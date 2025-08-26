import { Routes } from '@angular/router';

enum FEATURES_PAGE {
    AUTH = 'authentication',
    ADMIN = 'admin'
}

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: FEATURES_PAGE.AUTH
            },
            {
                path: FEATURES_PAGE.AUTH,
                loadChildren: () => import('./features/authentication/authentication.routes').then(r => r.AUTH_ROUTES)
            },
            {
                path: FEATURES_PAGE.ADMIN,
                loadChildren: () => import('./features/admin/admin.routes').then(r => r.ADMIN_ROUTES)
            },
        ]
    },
    {
        path: '**',
        redirectTo: FEATURES_PAGE.AUTH
    }
];
