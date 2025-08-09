import { Routes, provideRouter } from '@angular/router';
import { authGuard } from './auth/auth-guard';
import { DashboardLayoutComponent } from './pages/dashboard-layout/dashboard-layout';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { Forbidden403 } from './pages/error/forbidden-403/forbidden-403';

//  Public Routes (Unauthenticated)
const publicRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: '403', component: Forbidden403 }
];

// Protected Dashboard Routes (Authenticated)
const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'budgets',
        loadChildren: () =>
          import('./pages/budgets/budgets.routes').then((m) => m.routes)
      },
      {
        path: 'transactions',
        loadChildren: () =>
          import('./pages/transactions/transactions.routes').then((m) => m.routes)
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./pages/admin/admin.routes').then((m) => m.routes),
        canActivate: [authGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'analytics',
        loadChildren: () =>
          import('./pages/analytics-dashboard/analytics.routes').then((m) => m.routes),
        canActivate: [authGuard],
        data: { roles: ['ADMIN', 'USER'] }
      },
      {
        path: 'transaction-analytics',
        loadChildren: () =>
          import('./pages/transaction-analytics/transaction-analytics.routes').then((m) => m.routes),
        canActivate: [authGuard],
        data: { roles: ['ADMIN', 'USER'] }
      },
      {
        path: '', // Default redirect inside dashboard
        redirectTo: 'analytics',
        pathMatch: 'full'
      }
    ]
  }
];

//  Final Route Export
export const appRoutes: Routes = [
  ...publicRoutes,
  ...dashboardRoutes,
  { path: '**', redirectTo: '' } // Catch-all fallback
];

export const appRouter = provideRouter(appRoutes);
