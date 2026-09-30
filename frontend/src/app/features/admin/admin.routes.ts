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
      {
        path: 'skills',
        loadComponent: () =>
          import('./skills/skill-list/skill-list.component').then(
            (m) => m.SkillListComponent,
          ),
        title: 'Skills | Admin CMS',
      },
      {
        path: 'skills/create',
        loadComponent: () =>
          import('./skills/skill-form/skill-form.component').then(
            (m) => m.SkillFormComponent,
          ),
        title: 'Create Skill | Admin CMS',
      },
      {
        path: 'skills/:id/edit',
        loadComponent: () =>
          import('./skills/skill-form/skill-form.component').then(
            (m) => m.SkillFormComponent,
          ),
        title: 'Edit Skill | Admin CMS',
      },
      {
        path: 'experience',
        loadComponent: () =>
          import('./experience/experience-list/experience-list.component').then(
            (m) => m.ExperienceListComponent,
          ),
        title: 'Experience | Admin CMS',
      },
      {
        path: 'experience/create',
        loadComponent: () =>
          import('./experience/experience-form/experience-form.component').then(
            (m) => m.ExperienceFormComponent,
          ),
        title: 'Create Experience | Admin CMS',
      },
      {
        path: 'experience/:id/edit',
        loadComponent: () =>
          import('./experience/experience-form/experience-form.component').then(
            (m) => m.ExperienceFormComponent,
          ),
        title: 'Edit Experience | Admin CMS',
      },
      {
        path: 'education',
        loadComponent: () =>
          import('./education/education-list/education-list.component').then(
            (m) => m.EducationListComponent,
          ),
        title: 'Education | Admin CMS',
      },
      {
        path: 'education/create',
        loadComponent: () =>
          import('./education/education-form/education-form.component').then(
            (m) => m.EducationFormComponent,
          ),
        title: 'Create Education | Admin CMS',
      },
      {
        path: 'education/:id/edit',
        loadComponent: () =>
          import('./education/education-form/education-form.component').then(
            (m) => m.EducationFormComponent,
          ),
        title: 'Edit Education | Admin CMS',
      },
    ],
  },
];
