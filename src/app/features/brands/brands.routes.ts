import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./brand-list/brand-list.component').then(m => m.BrandListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./brand-form/brand-form.component').then(m => m.BrandFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./brand-form/brand-form.component').then(m => m.BrandFormComponent)
  }
];