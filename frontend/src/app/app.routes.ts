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
        data: {
          description:
            'Explore the developer portfolio, projects, skills, and technical articles by Dim Sareach, Full Stack Developer.',
          keywords: 'Dim Sareach, full stack developer, software engineer, portfolio, angular, node.js',
        },
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/public/about/about.component').then(
            (m) => m.AboutComponent,
          ),
        title: 'About Me | Dim Sareach',
        data: {
          description:
            'Learn more about Dim Sareach, professional background, expertise, technical philosophy, and experience.',
          keywords: 'about dim sareach, full stack engineer, software developer bio',
        },
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./features/public/skills/skills.component').then(
            (m) => m.SkillsComponent,
          ),
        title: 'Skills & Expertise | Dim Sareach',
        data: {
          description:
            'Comprehensive directory of technical skills, frameworks, cloud tools, and programming languages mastered by Dim Sareach.',
          keywords: 'technical skills, frontend, backend, devops, database, typescript, angular',
        },
      },
      {
        path: 'experience',
        loadComponent: () =>
          import('./features/public/experience/experience.component').then(
            (m) => m.ExperienceComponent,
          ),
        title: 'Work Experience | Dim Sareach',
        data: {
          description:
            'Career history, software engineering roles, team leadership, and impactful technical accomplishments by Dim Sareach.',
          keywords: 'work experience, career, software engineer roles, accomplishments',
        },
      },
      {
        path: 'education',
        loadComponent: () =>
          import('./features/public/education/education.component').then(
            (m) => m.EducationComponent,
          ),
        title: 'Education & Certifications | Dim Sareach',
        data: {
          description:
            'Academic qualifications, university degrees, and professional certifications earned by Dim Sareach.',
          keywords: 'education, certifications, degrees, credentials',
        },
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/public/projects/project-list.component').then(
            (m) => m.ProjectListComponent,
          ),
        title: 'Projects | Dim Sareach',
        data: {
          description:
            'Curated portfolio of software engineering projects, modern web applications, and architectural case studies.',
          keywords: 'software projects, web applications, case studies, open source',
        },
      },
      {
        path: 'projects/:slug',
        loadComponent: () =>
          import('./features/public/projects/project-detail.component').then(
            (m) => m.ProjectDetailComponent,
          ),
        title: 'Project Details | Dim Sareach',
        data: {
          description:
            'Detailed project case study, tech stack breakdown, architecture overview, and live demo links.',
        },
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./features/public/blog/blog-list.component').then(
            (m) => m.BlogListComponent,
          ),
        title: 'Blog & Articles | Dim Sareach',
        data: {
          description:
            'Technical engineering blog, guides, best practices, and architecture articles by Dim Sareach.',
          keywords: 'engineering blog, programming tutorials, tech articles, software insights',
        },
      },
      {
        path: 'blog/:slug',
        loadComponent: () =>
          import('./features/public/blog/blog-detail.component').then(
            (m) => m.BlogDetailComponent,
          ),
        title: 'Blog Article | Dim Sareach',
        data: {
          description:
            'Read this in-depth technical article and software engineering guide by Dim Sareach.',
        },
      },
      {
        path: 'achievements',
        loadComponent: () =>
          import(
            './features/public/achievements/achievements.component'
          ).then((m) => m.AchievementsComponent),
        title: 'Achievements | Dim Sareach',
        data: {
          description:
            'Key milestones, awards, honors, and notable community contributions by Dim Sareach.',
          keywords: 'achievements, awards, honors, software milestones',
        },
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/public/contact/contact.component').then(
            (m) => m.ContactComponent,
          ),
        title: 'Contact | Dim Sareach',
        data: {
          description:
            'Get in touch with Dim Sareach for project inquiries, freelance opportunities, consultations, or collaborations.',
          keywords: 'contact dim sareach, hire full stack developer, software engineer contact',
        },
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
    data: {
      robots: 'noindex, nofollow',
    },
  },

  // Admin protected management routes
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
    data: {
      robots: 'noindex, nofollow',
    },
  },

  // 404 Wildcard Page
  {
    path: '**',
    loadComponent: () =>
      import('./features/public/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
    title: '404 - Page Not Found | Dim Sareach',
    data: {
      robots: 'noindex, nofollow',
      description: 'The requested page could not be found.',
    },
  },
];
