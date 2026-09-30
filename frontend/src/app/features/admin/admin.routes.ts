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
      {
        path: 'certifications',
        loadComponent: () =>
          import('./certifications/certification-list/certification-list.component').then(
            (m) => m.CertificationListComponent,
          ),
        title: 'Certifications | Admin CMS',
      },
      {
        path: 'certifications/create',
        loadComponent: () =>
          import('./certifications/certification-form/certification-form.component').then(
            (m) => m.CertificationFormComponent,
          ),
        title: 'Create Certification | Admin CMS',
      },
      {
        path: 'certifications/:id/edit',
        loadComponent: () =>
          import('./certifications/certification-form/certification-form.component').then(
            (m) => m.CertificationFormComponent,
          ),
        title: 'Edit Certification | Admin CMS',
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./blog/blog-list/blog-list.component').then(
            (m) => m.BlogListComponent,
          ),
        title: 'Blog Posts | Admin CMS',
      },
      {
        path: 'blog/create',
        loadComponent: () =>
          import('./blog/blog-form/blog-form.component').then(
            (m) => m.BlogFormComponent,
          ),
        title: 'Create Blog Post | Admin CMS',
      },
      {
        path: 'blog/:id/edit',
        loadComponent: () =>
          import('./blog/blog-form/blog-form.component').then(
            (m) => m.BlogFormComponent,
          ),
        title: 'Edit Blog Post | Admin CMS',
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./categories/category-list.component').then(
            (m) => m.CategoryListComponent,
          ),
        title: 'Categories | Admin CMS',
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./messages/message-list.component').then(
            (m) => m.MessageListComponent,
          ),
        title: 'Messages | Admin CMS',
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/profile-form.component').then(
            (m) => m.ProfileFormComponent,
          ),
        title: 'Profile | Admin CMS',
      },
      {
        path: 'social-links',
        loadComponent: () =>
          import('./social-links/social-link-list.component').then(
            (m) => m.SocialLinkListComponent,
          ),
        title: 'Social Links | Admin CMS',
      },
      {
        path: 'media',
        loadComponent: () =>
          import('./media/media-list.component').then(
            (m) => m.MediaListComponent,
          ),
        title: 'Media Library | Admin CMS',
      },
      {
        path: 'cv',
        loadComponent: () =>
          import('./cv/cv-manager.component').then(
            (m) => m.CvManagerComponent,
          ),
        title: 'CV Management | Admin CMS',
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/settings-form.component').then(
            (m) => m.SettingsFormComponent,
          ),
        title: 'System Settings | Admin CMS',
      },
      {
        path: 'achievements',
        redirectTo: 'certifications',
        pathMatch: 'full',
      },
    ],
  },
];

