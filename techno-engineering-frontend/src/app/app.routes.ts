import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'users',
    canActivate: [authGuard],
    loadChildren: () => import('./features/users/users.routes').then(m => m.routes)
  },
  {
    path: 'customers',
    canActivate: [authGuard],
    loadChildren: () => import('./features/customers/customers.routes').then(m => m.routes)
  },
  {
    path: 'products',
    canActivate: [authGuard],
    loadChildren: () => import('./features/products/products.routes').then(m => m.routes)
  },
  {
    path: 'brands',
    canActivate: [authGuard],
    loadChildren: () => import('./features/brands/brands.routes').then(m => m.routes)
  },
  {
    path: 'categories',
    canActivate: [authGuard],
    loadChildren: () => import('./features/categories/categories.routes').then(m => m.routes)
  },
  {
    path: 'enquiries',
    canActivate: [authGuard],
    loadChildren: () => import('./features/enquiries/enquiries.routes').then(m => m.routes)
  },
  {
    path: 'quotations',
    canActivate: [authGuard],
    loadChildren: () => import('./features/quotations/quotations.routes').then(m => m.routes)
  },
  {
    path: 'customer-portal',
    canActivate: [authGuard],
    loadComponent: () => import('./features/customer-portal/customer-portal.component').then(m => m.CustomerPortalComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];