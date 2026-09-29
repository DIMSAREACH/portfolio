import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards';

export const routes: Routes = [
  // Public layout wrapping public portfolio routes
  {
    path: '',
    loadComponent: () =>
      import('./features/public/public-layout/public-layout.component').then(
        (m) => m.PublicLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/public/home/home.component').then(
            (m) => m.HomeComponent,
          ),
        title: 'Home | Dim Sareach',
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/public/about/about.component').then(
            (m) => m.AboutComponent,
          ),
        title: 'About Me | Dim Sareach',
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./features/public/skills/skills.component').then(
            (m) => m.SkillsComponent,
          ),
        title: 'Skills & Expertise | Dim Sareach',
      },
      {
        path: 'experience',
        loadComponent: () =>
          import('./features/public/experience/experience.component').then(
            (m) => m.ExperienceComponent,
          ),
        title: 'Work Experience | Dim Sareach',
      },
      {
        path: 'education',
        loadComponent: () =>
          import('./features/public/education/education.component').then(
            (m) => m.EducationComponent,
          ),
        title: 'Education & Certifications | Dim Sareach',
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/public/projects/project-list.component').then(
            (m) => m.ProjectListComponent,
          ),
        title: 'Projects | Dim Sareach',
      },
      {
        path: 'projects/:slug',
        loadComponent: () =>
          import('./features/public/projects/project-detail.component').then(
            (m) => m.ProjectDetailComponent,
          ),
        title: 'Project Details | Dim Sareach',
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./features/public/blog/blog-list.component').then(
            (m) => m.BlogListComponent,
          ),
        title: 'Blog & Articles | Dim Sareach',
      },
      {
        path: 'blog/:slug',
        loadComponent: () =>
          import('./features/public/blog/blog-detail.component').then(
            (m) => m.BlogDetailComponent,
          ),
        title: 'Blog Article | Dim Sareach',
      },
      {
        path: 'achievements',
        loadComponent: () =>
          import(
            './features/public/achievements/achievements.component'
          ).then((m) => m.AchievementsComponent),
        title: 'Achievements | Dim Sareach',
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/public/contact/contact.component').then(
            (m) => m.ContactComponent,
          ),
        title: 'Contact | Dim Sareach',
      },
    ],
  },

  // Admin login page (unauthenticated guest only)
  {
    path: 'admin/login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/admin/login/login.component').then(
        (m) => m.LoginComponent,
      ),
    title: 'Admin Login | Portfolio CMS',
  },

  // Admin protected management routes
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },

  // 404 Wildcard Page
  {
    path: '**',
    loadComponent: () =>
      import('./features/public/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
    title: '404 - Page Not Found | Dim Sareach',
  },
];
