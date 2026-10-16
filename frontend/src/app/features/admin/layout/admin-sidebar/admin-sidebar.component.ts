import { Component, Input, Output, EventEmitter, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { LanguageService } from '../../../../core/services/language.service';

export interface AdminNavItem {
  label: string;
  labelKh?: string;
  path: string;
  icon: string;
  exact?: boolean;
}

export interface AdminNavGroup {
  groupName: string;
  groupNameKh?: string;
  items: AdminNavItem[];
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    AvatarModule,
    ButtonModule,
  ],
  styles: [
    `
      .sidebar-item-active {
        background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%) !important;
        color: #ffffff !important;
        box-shadow: 0 4px 14px -2px rgba(99, 102, 241, 0.45) !important;
      }
      .sidebar-item-active .item-icon-box {
        background: rgba(255, 255, 255, 0.22) !important;
        color: #ffffff !important;
      }
      .sidebar-item-active .active-indicator {
        opacity: 1 !important;
      }
      a:focus {
        outline: none !important;
      }
      a:focus-visible {
        outline: none !important;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.45) !important;
      }
    `,
  ],
  template: `
    <aside
      class="fixed inset-y-0 left-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0 shadow-xl lg:shadow-none"
      [class.translate-x-0]="isOpen"
      [class.-translate-x-full]="!isOpen"
      [ngClass]="isCollapsed ? 'lg:w-20 w-64' : 'lg:w-64 w-64'"
      aria-label="Admin Navigation"
    >
      <!-- Top Brand Header -->
      <div
        class="h-16 flex items-center border-b border-slate-200/80 dark:border-slate-800/80 shrink-0 transition-all duration-300"
        [ngClass]="isCollapsed ? 'px-3 justify-center' : 'px-5 justify-between'"
      >
        <a
          routerLink="/admin/dashboard"
          (click)="onItemClick()"
          class="flex items-center gap-2.5 focus:outline-none group text-decoration-none"
          [title]="isCollapsed ? 'Sareach.dev Admin Dashboard' : ''"
        >
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform shrink-0">
            S
          </div>
          <div class="flex flex-col text-left transition-opacity duration-200" [class.hidden]="isCollapsed">
            <span class="text-sm font-extrabold text-slate-900 dark:text-white leading-tight font-brand whitespace-nowrap">
              Sareach<span class="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent font-black ml-0.5">.dev</span>
            </span>
            <span class="text-[9px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 whitespace-nowrap" [class.font-khmer]="isKhmer()">
              {{ isKhmer() ? 'មជ្ឈមណ្ឌលគ្រប់គ្រង CMS' : 'CMS Control Center' }}
            </span>
          </div>
        </a>

        <!-- Mobile Close Button -->
        <button
          type="button"
          (click)="closeSidebar.emit()"
          class="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
          aria-label="Close sidebar"
        >
          <i class="pi pi-times text-xs"></i>
        </button>
      </div>

      <!-- Navigation Menu Groups (Scrollable) -->
      <nav
        class="flex-1 overflow-y-auto space-y-4 transition-all duration-300"
        [ngClass]="isCollapsed ? 'px-2 py-4' : 'px-3 py-4'"
        aria-label="Sidebar Menu"
      >
        @for (group of navGroups; track group.groupName) {
          <div class="space-y-1">
            <!-- Group Header (hidden in collapsed mode) -->
            <h3
              class="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 transition-opacity duration-200"
              [class.font-khmer]="isKhmer()"
              [class.hidden]="isCollapsed"
            >
              {{ isKhmer() ? (group.groupNameKh || group.groupName) : group.groupName }}
            </h3>
            @if (isCollapsed) {
              <div class="h-px bg-slate-200/60 dark:bg-slate-800/60 my-2 mx-1.5"></div>
            }

            <div class="space-y-0.5">
              @for (item of group.items; track item.path) {
                <a
                  [routerLink]="item.path"
                  (click)="onItemClick()"
                  routerLinkActive="sidebar-item-active"
                  [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
                  [title]="isKhmer() ? (item.labelKh || item.label) : item.label"
                  class="flex items-center rounded-xl text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white transition-all group relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 select-none"
                  [ngClass]="isCollapsed ? 'p-2 justify-center' : 'px-3 py-2 gap-2.5'"
                >
                  <!-- Icon Box -->
                  <span class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/60 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors item-icon-box relative">
                    <i class="pi text-xs" [ngClass]="getIconClass(item.icon)"></i>

                    <!-- Collapsed Unread Dot Indicator -->
                    @if (isCollapsed && item.path === '/admin/messages' && unreadMessageCount() > 0) {
                      <span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900"></span>
                    }
                  </span>

                  <!-- Nav Label (hidden in collapsed mode) -->
                  <span class="flex-1 truncate" [class.font-khmer]="isKhmer()" [class.hidden]="isCollapsed">
                    {{ isKhmer() ? (item.labelKh || item.label) : item.label }}
                  </span>

                  <!-- Expanded Unread Messages Count Badge -->
                  @if (item.path === '/admin/messages' && unreadMessageCount() > 0) {
                    <span
                      class="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-xs ml-auto"
                      [class.hidden]="isCollapsed"
                      id="sidebar-unread-badge"
                    >
                      {{ unreadMessageCount() }}
                    </span>
                  }

                  <!-- Active Right Arrow/Dot Indicator -->
                  <span
                    class="w-1.5 h-1.5 rounded-full bg-white opacity-0 transition-opacity active-indicator ml-auto"
                    [class.hidden]="isCollapsed"
                  ></span>
                </a>
              }
            </div>
          </div>
        }
      </nav>

      <!-- Bottom User Profile Footer -->
      <div
        class="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60 shrink-0 transition-all duration-300"
        [ngClass]="isCollapsed ? 'p-2 flex justify-center' : 'p-3'"
      >
        @if (isCollapsed) {
          <button
            type="button"
            (click)="toggleCollapse.emit()"
            class="size-10 rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            [title]="userName() + ' (Click to expand)'"
          >
            <p-avatar
              [image]="userAvatar()"
              shape="circle"
              class="size-8 shadow-xs ring-1 ring-slate-200/80 dark:ring-slate-700/80"
            />
          </button>
        } @else {
          <div class="p-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-2 shadow-2xs">
            <div class="flex items-center gap-2.5 min-w-0">
              <p-avatar
                [image]="userAvatar()"
                shape="circle"
                class="size-8 shrink-0 shadow-xs ring-1 ring-slate-200/80 dark:ring-slate-700/80"
              />
              <div class="flex flex-col min-w-0 text-left">
                <span class="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">
                  {{ userName() }}
                </span>
                <span class="text-[11px] font-normal text-slate-500 dark:text-slate-400 truncate leading-tight font-sans tracking-tight">
                  {{ userEmail() }}
                </span>
              </div>
            </div>

            <a
              routerLink="/"
              target="_blank"
              [title]="isKhmer() ? 'មើលគេហទំព័រផលប័ត្រផ្ទាល់' : 'View live portfolio website'"
              class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors shrink-0"
            >
              <i class="pi pi-external-link text-xs"></i>
            </a>
          </div>
        }
      </div>
    </aside>
  `,
})
export class AdminSidebarComponent implements OnInit {
  public readonly authService = inject(AuthService);
  private readonly portfolioService = inject(PortfolioService, { optional: true });
  public readonly languageService = inject(LanguageService);
  public readonly isKhmer = this.languageService.isKhmer;

  @Input() public isOpen = false;
  @Input() public isCollapsed = false;
  @Output() public closeSidebar = new EventEmitter<void>();
  @Output() public toggleCollapse = new EventEmitter<void>();

  public readonly unreadMessageCount = signal<number>(0);

  public readonly userName = computed<string>(() => {
    const user = this.authService.currentUser();
    return user?.fullName || 'Dim Sareach';
  });

  public readonly userEmail = computed<string>(() => {
    const user = this.authService.currentUser();
    return user?.email || 'admin@portfolio.dev';
  });

  public readonly userInitials = computed<string>(() => {
    const name = this.userName().trim();
    if (!name) return 'DS';
    const parts = name.split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });

  public readonly userAvatar = computed<string>(() => {
    const user = this.authService.currentUser();
    return user?.avatar || 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png';
  });

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

  // Exactly 15 Admin Sections per PRD Section 9.1
  public readonly navGroups: AdminNavGroup[] = [
    {
      groupName: 'Main',
      groupNameKh: 'ទំព័រចម្បង',
      items: [
        { label: 'Dashboard', labelKh: 'ផ្ទាំងគ្រប់គ្រង', path: '/admin/dashboard', exact: true, icon: 'dashboard' },
        { label: 'Profile', labelKh: 'ព័ត៌មានផ្ទាល់ខ្លួន', path: '/admin/profile', icon: 'profile' },
      ],
    },
    {
      groupName: 'Portfolio Content',
      groupNameKh: 'មាតិកាផលប័ត្រ',
      items: [
        { label: 'Projects', labelKh: 'គម្រោង', path: '/admin/projects', icon: 'projects' },
        { label: 'Skills', labelKh: 'ជំនាញ', path: '/admin/skills', icon: 'skills' },
        { label: 'Experience', labelKh: 'បទពិសោធន៍', path: '/admin/experience', icon: 'experience' },
        { label: 'Education', labelKh: 'ការអប់រំ', path: '/admin/education', icon: 'education' },
        { label: 'Certifications', labelKh: 'វិញ្ញាបនបត្រ', path: '/admin/certifications', icon: 'certifications' },
      ],
    },
    {
      groupName: 'Media & Communications',
      groupNameKh: 'ប្រព័ន្ធផ្សព្វផ្សាយ & ទំនាក់ទំនង',
      items: [
        { label: 'Media', labelKh: 'មេឌា', path: '/admin/media', icon: 'media' },
        { label: 'Messages', labelKh: 'សារទំនាក់ទំនង', path: '/admin/messages', icon: 'messages' },
        { label: 'CV / Resume', labelKh: 'ប្រវត្តិរូបសង្ខេប', path: '/admin/cv', icon: 'cv' },
      ],
    },
    {
      groupName: 'Configuration',
      groupNameKh: 'ការកំណត់រចនាសម្ព័ន្ធ',
      items: [
        { label: 'Social Links', labelKh: 'បណ្តាញសង្គម', path: '/admin/social-links', icon: 'social-links' },
        { label: 'Settings', labelKh: 'ការកំណត់', path: '/admin/settings', icon: 'settings' },
      ],
    },
  ];

  public getIconClass(icon: string): string {
    switch (icon) {
      case 'dashboard': return 'pi-th-large';
      case 'profile': return 'pi-user';
      case 'projects': return 'pi-folder';
      case 'skills': return 'pi-code';
      case 'experience': return 'pi-briefcase';
      case 'education': return 'pi-graduation-cap';
      case 'certifications': return 'pi-verified';
      case 'achievements': return 'pi-star';
      case 'categories': return 'pi-tags';
      case 'media': return 'pi-images';
      case 'messages': return 'pi-inbox';
      case 'cv': return 'pi-file-pdf';
      case 'social-links': return 'pi-share-alt';
      case 'settings': return 'pi-cog';
      default: return 'pi-circle';
    }
  }

  public onItemClick(): void {
    this.closeSidebar.emit();
  }
}
