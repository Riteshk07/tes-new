import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./enquiry-list/enquiry-list.component').then(m => m.EnquiryListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./enquiry-form/enquiry-form.component').then(m => m.EnquiryFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./enquiry-form/enquiry-form.component').then(m => m.EnquiryFormComponent)
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./enquiry-detail/enquiry-detail.component').then(m => m.EnquiryDetailComponent)
  }
];