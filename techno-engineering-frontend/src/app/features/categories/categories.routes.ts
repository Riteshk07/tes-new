import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./category-list/category-list.component').then(m => m.CategoryListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./category-form/category-form.component').then(m => m.CategoryFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./category-form/category-form.component').then(m => m.CategoryFormComponent)
  }
];