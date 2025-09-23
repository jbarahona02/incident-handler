import { Routes } from '@angular/router';

enum FEATURES_PAGE {
    AUTH = 'authentication',
    ADMIN = 'admin',
    REPORTER = 'reporter',
    TECHNICAL_SUPPORT = "technical-support"
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
            {
                path: FEATURES_PAGE.REPORTER,
                loadChildren: () => import('./features/reporter/reporter.routes').then(r => r.REPORTER_ROUTES)
            },
            {
                path: FEATURES_PAGE.TECHNICAL_SUPPORT,
                loadChildren: () => import('./features/technical-support/technical-support.route').then(r => r.REPORTER_ROUTES)
            }
        ]
    },
    {
        path: '**',
        redirectTo: FEATURES_PAGE.AUTH
    }
];
