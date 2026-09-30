import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
        title: 'Dashboard | Admin CMS',
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./projects/project-list/project-list.component').then(
            (m) => m.ProjectListComponent,
          ),
        title: 'Projects | Admin CMS',
      },
      {
        path: 'projects/create',
        loadComponent: () =>
          import('./projects/project-form/project-form.component').then(
            (m) => m.ProjectFormComponent,
          ),
        title: 'Create Project | Admin CMS',
      },
      {
        path: 'projects/:id/edit',
        loadComponent: () =>
          import('./projects/project-form/project-form.component').then(
            (m) => m.ProjectFormComponent,
          ),
        title: 'Edit Project | Admin CMS',
      },
    ],
  },
];
