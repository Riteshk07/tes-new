import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./product-form/product-form.component').then(m => m.ProductFormComponent)
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  }
];