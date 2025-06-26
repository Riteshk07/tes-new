import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./quotation-list/quotation-list.component').then(m => m.QuotationListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./quotation-form/quotation-form.component').then(m => m.QuotationFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./quotation-form/quotation-form.component').then(m => m.QuotationFormComponent)
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./quotation-detail/quotation-detail.component').then(m => m.QuotationDetailComponent)
  }
];