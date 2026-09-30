import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { PortfolioService } from '../../../../core/services/portfolio.service';

export interface AdminNavItem {
  label: string;
  path: string;
  icon: string;
  exact?: boolean;
}

export interface AdminNavGroup {
  groupName: string;
  items: AdminNavItem[];
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-xl lg:shadow-none"
      [class.translate-x-0]="isOpen"
      [class.-translate-x-full]="!isOpen"
      aria-label="Admin Navigation"
    >
      <!-- Top Brand Header -->
      <div class="h-16 flex items-center justify-between px-6 border-b border-slate-200/80 dark:border-slate-800">
        <a routerLink="/admin/dashboard" (click)="onItemClick()" class="flex items-center gap-2.5 focus:outline-none">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
            S
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-bold text-slate-900 dark:text-white leading-tight">Sareach.dev</span>
            <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Admin CMS</span>
          </div>
        </a>

        <!-- Mobile Close Button -->
        <button
          type="button"
          (click)="closeSidebar.emit()"
          class="lg:hidden p-1.5 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          aria-label="Close sidebar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Scrollable Navigation Items -->
      <nav class="flex-1 overflow-y-auto px-4 py-4 space-y-6" aria-label="Sidebar Menu">
        @for (group of navGroups; track group.groupName) {
          <div class="space-y-1">
            <h3 class="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {{ group.groupName }}
            </h3>

            @for (item of group.items; track item.path) {
              <a
                [routerLink]="item.path"
                (click)="onItemClick()"
                routerLinkActive="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border-l-4 border-indigo-600 dark:border-indigo-400"
                [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
                class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <!-- Nav Item Icon via Switch -->
                <span class="w-5 h-5 flex items-center justify-center flex-shrink-0 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500">
                  @switch (item.icon) {
                    @case ('dashboard') {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                    }
                    @case ('profile') {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    }
                    @case ('projects') {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
                    }
                    @case ('skills') {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                    }
                    @case ('experience') {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    }
                    @case ('education') {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/></svg>
                    }
                    @case ('certifications') {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
                    }
                    @case ('achievements') {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                    }
                    @case ('blog') {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                    }
                    @case ('categories') {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                    }
                    @case ('media') {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    }
                    @case ('messages') {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    }
                    @case ('cv') {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    }
                    @case ('social-links') {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                    }
                    @case ('settings') {
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    }
                  }
                </span>
                <span class="flex-1">{{ item.label }}</span>
                @if (item.path === '/admin/messages' && unreadMessageCount() > 0) {
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white shadow-2xs" id="sidebar-unread-badge">
                    {{ unreadMessageCount() }}
                  </span>
                }
              </a>
            }
          </div>
        }
      </nav>

      <!-- Bottom User / Logout Footer -->
      <div class="p-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
        <a
          routerLink="/"
          target="_blank"
          class="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>Live Portfolio</span>
          </span>
          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </aside>
  `,
})
export class AdminSidebarComponent implements OnInit {
  public readonly authService = inject(AuthService);
  private readonly portfolioService = inject(PortfolioService, { optional: true });

  @Input() public isOpen = false;
  @Output() public closeSidebar = new EventEmitter<void>();

  public readonly unreadMessageCount = signal<number>(0);

  public ngOnInit(): void {
    if (this.portfolioService) {
      this.portfolioService.getDashboardStats().pipe(catchError(() => of(null))).subscribe({
        next: (res) => {
          if (res?.data?.unreadMessages !== undefined) {
            this.unreadMessageCount.set(res.data.unreadMessages);
          }
        },
      });
    }
  }

  // 15 Admin Sections per PRD Section 9.1
  public readonly navGroups: AdminNavGroup[] = [
    {
      groupName: 'Main',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', exact: true, icon: 'dashboard' },
        { label: 'Profile', path: '/admin/profile', icon: 'profile' },
      ],
    },
    {
      groupName: 'Portfolio Content',
      items: [
        { label: 'Projects', path: '/admin/projects', icon: 'projects' },
        { label: 'Skills', path: '/admin/skills', icon: 'skills' },
        { label: 'Experience', path: '/admin/experience', icon: 'experience' },
        { label: 'Education', path: '/admin/education', icon: 'education' },
        { label: 'Certifications', path: '/admin/certifications', icon: 'certifications' },
        { label: 'Achievements', path: '/admin/achievements', icon: 'achievements' },
      ],
    },
    {
      groupName: 'Articles & Taxonomy',
      items: [
        { label: 'Blog Posts', path: '/admin/blog', icon: 'blog' },
        { label: 'Categories', path: '/admin/categories', icon: 'categories' },
      ],
    },
    {
      groupName: 'Media & Communications',
      items: [
        { label: 'Media', path: '/admin/media', icon: 'media' },
        { label: 'Messages', path: '/admin/messages', icon: 'messages' },
        { label: 'CV / Resume', path: '/admin/cv', icon: 'cv' },
      ],
    },
    {
      groupName: 'Configuration',
      items: [
        { label: 'Social Links', path: '/admin/social-links', icon: 'social-links' },
        { label: 'Settings', path: '/admin/settings', icon: 'settings' },
      ],
    },
  ];

  public onItemClick(): void {
    this.closeSidebar.emit();
  }
}
