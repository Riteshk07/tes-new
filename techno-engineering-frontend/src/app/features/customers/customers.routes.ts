import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./customer-list/customer-list.component').then(m => m.CustomerListComponent)
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./customer-detail/customer-detail.component').then(m => m.CustomerDetailComponent)
  }
];