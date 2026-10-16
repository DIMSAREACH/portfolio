import { Component, Input, Output, EventEmitter, OnInit, HostListener, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { LanguageService } from '../../../../core/services/language.service';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';
import { LanguageSwitcherComponent } from '../../../../shared/components/language-switcher/language-switcher.component';
import { Message } from '../../../../core/models';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ThemeToggleComponent,
    LanguageSwitcherComponent,
    AvatarModule,
    ButtonModule,
    MenuModule,
  ],
  template: `
    <header class="h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-40 transition-colors duration-300">
      <!-- Left: Mobile Menu Toggle, Desktop Collapse Toggle & Breadcrumbs -->
      <div class="flex items-center gap-3">
        <!-- Mobile Menu Toggle Button (Strictly Hidden on Desktop) -->
        <div class="lg:hidden flex items-center">
          <button
            type="button"
            (click)="toggleSidebar.emit()"
            class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none cursor-pointer flex items-center justify-center transition-colors"
            id="admin-sidebar-toggle-btn"
            aria-label="Toggle navigation sidebar"
          >
            <i class="pi pi-bars text-sm"></i>
          </button>
        </div>

        <!-- Desktop Sidebar Collapse / Expand Toggle Button -->
        <button
          type="button"
          (click)="toggleCollapse.emit()"
          class="hidden lg:flex items-center justify-center w-8 h-8 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100/80 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-slate-700/80 focus:outline-none cursor-pointer transition-all shadow-2xs mr-2"
          [title]="isCollapsed ? (isKhmer() ? 'ពង្រីករបារចំហៀង' : 'Expand sidebar') : (isKhmer() ? 'បង្រួមរបារចំហៀង' : 'Collapse sidebar')"
          aria-label="Toggle sidebar collapse"
          id="admin-desktop-sidebar-collapse-btn"
        >
          <i class="pi text-xs" [ngClass]="isCollapsed ? 'pi-arrow-right' : 'pi-bars'"></i>
        </button>

        <!-- Breadcrumb & Control Center Identity -->
        <div class="flex items-center gap-2 text-xs sm:text-sm">
          <span class="text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider text-[11px]" [class.font-khmer]="isKhmer()">
            {{ isKhmer() ? 'អ្នកគ្រប់គ្រង' : 'Admin' }}
          </span>
          <i class="pi pi-angle-right text-[10px] text-slate-400 dark:text-slate-600"></i>
          <span class="font-extrabold text-slate-900 dark:text-white tracking-tight" [class.font-khmer]="isKhmer()">
            {{ isKhmer() ? 'មជ្ឈមណ្ឌលបញ្ជា' : 'Control Center' }}
          </span>
          <span class="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 ml-2" [class.font-khmer]="isKhmer()">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {{ isKhmer() ? 'បន្តផ្ទាល់' : 'Live' }}
          </span>
        </div>
      </div>

      <!-- Right: Live Site, Language Switcher, Theme, Notifications, Avatar, Logout -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Live Portfolio Link Button -->
        <a
          routerLink="/"
          target="_blank"
          class="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-colors"
          [class.font-khmer]="isKhmer()"
          [title]="isKhmer() ? 'មើលគេហទំព័រផលប័ត្រផ្ទាល់' : 'Open live public portfolio website'"
        >
          <i class="pi pi-external-link text-[11px]"></i>
          <span>{{ isKhmer() ? 'គេហទំព័រផ្ទាល់' : 'Live Site' }}</span>
        </a>

        <!-- EN & KH Language Switcher -->
        <app-language-switcher class="inline-block"></app-language-switcher>

        <!-- Theme Toggle -->
        <app-theme-toggle></app-theme-toggle>

        <!-- Notifications Bell & Dropdown -->
        <div class="relative">
          <button
            type="button"
            (click)="toggleNotifications()"
            class="relative w-9 h-9 !rounded-full flex items-center justify-center bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/90 dark:hover:bg-slate-700/90 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 transition-all duration-300 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer focus:outline-none"
            [class.bg-indigo-50]="isNotificationsOpen()"
            [class.dark:bg-indigo-950/60]="isNotificationsOpen()"
            [class.text-indigo-600]="isNotificationsOpen()"
            [class.border-indigo-300]="isNotificationsOpen()"
            id="admin-notifications-btn"
            aria-label="Toggle notifications menu"
            [title]="unreadCount() > 0 ? (isKhmer() ? 'សារមិនទាន់អាន ' + unreadCount() : unreadCount() + ' unread inquiries') : (isKhmer() ? 'ការជូនដំណឹង' : 'Notifications')"
          >
            <i class="pi pi-bell text-base"></i>
            @if (unreadCount() > 0) {
              <span
                id="admin-notifications-badge"
                class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black bg-rose-500 text-white flex items-center justify-center shadow-xs ring-2 ring-white dark:ring-slate-900 animate-pulse"
              >
                {{ unreadCount() > 99 ? '99+' : unreadCount() }}
              </span>
            }
          </button>

          <!-- Notifications Dropdown Panel -->
          @if (isNotificationsOpen()) {
            <div
              class="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-fadeIn"
              id="admin-notifications-dropdown"
            >
              <!-- Panel Header -->
              <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-slate-900 dark:text-white" [class.font-khmer]="isKhmer()">
                    {{ isKhmer() ? 'សារសាកសួរ & ការជូនដំណឹង' : 'Inquiries & Alerts' }}
                  </span>
                  @if (unreadCount() > 0) {
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400" [class.font-khmer]="isKhmer()">
                      {{ isKhmer() ? 'ថ្មី ' + unreadCount() : unreadCount() + ' new' }}
                    </span>
                  }
                </div>
                <div class="flex items-center gap-2">
                  @if (unreadCount() > 0) {
                    <button
                      type="button"
                      (click)="markAllAsRead()"
                      class="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      [class.font-khmer]="isKhmer()"
                      title="Mark all as read"
                    >
                      {{ isKhmer() ? 'សម្គាល់ថាបានអាន' : 'Mark all read' }}
                    </button>
                  }
                  <button
                    type="button"
                    (click)="closeNotifications()"
                    class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer transition-colors"
                    aria-label="Close notifications panel"
                  >
                    <i class="pi pi-times text-xs"></i>
                  </button>
                </div>
              </div>

              <!-- Notifications List -->
              <div class="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                @if (recentMessages().length === 0) {
                  <div class="p-6 text-center text-slate-400 dark:text-slate-500 space-y-1.5">
                    <i class="pi pi-check-circle text-2xl text-emerald-500"></i>
                    <p class="text-xs font-semibold text-slate-700 dark:text-slate-300" [class.font-khmer]="isKhmer()">
                      {{ isKhmer() ? 'បានរួចរាល់ទាំងអស់!' : 'All caught up!' }}
                    </p>
                    <p class="text-[11px]" [class.font-khmer]="isKhmer()">
                      {{ isKhmer() ? 'គ្មានសារសាកសួរ ឬការជូនដំណឹងដែលមិនទាន់អានទេ។' : 'No unread inquiries or system alerts.' }}
                    </p>
                  </div>
                } @else {
                  @for (msg of recentMessages(); track msg._id) {
                    <a
                      routerLink="/admin/messages"
                      (click)="closeNotifications()"
                      class="block p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left text-decoration-none group cursor-pointer"
                    >
                      <div class="flex items-start gap-2.5">
                        <div class="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                          <i class="pi pi-envelope text-xs"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center justify-between gap-2">
                            <span class="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {{ msg.name }}
                            </span>
                            <span class="text-[10px] text-slate-400 whitespace-nowrap">
                              {{ formatTimeAgo(msg.createdAt) }}
                            </span>
                          </div>
                          <p class="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate mt-0.5">
                            {{ msg.subject || (isKhmer() ? 'សារសាកសួរថ្មី' : 'New Contact Inquiry') }}
                          </p>
                          <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {{ msg.message }}
                          </p>
                        </div>
                      </div>
                    </a>
                  }
                }
              </div>

              <!-- Panel Footer -->
              <div class="p-2.5 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <a
                  routerLink="/admin/messages"
                  (click)="closeNotifications()"
                  class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                  [class.font-khmer]="isKhmer()"
                >
                  <span>{{ isKhmer() ? 'មើលសារទាំងអស់' : 'View all messages' }}</span>
                  <i class="pi pi-arrow-right text-[10px]"></i>
                </a>
              </div>
            </div>
          }
        </div>

        <div class="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

        <!-- User Avatar with Profile Dropdown Menu -->
        <div class="relative flex items-center">
          <button
            type="button"
            (click)="toggleProfileMenu($event)"
            class="relative flex items-center justify-center rounded-full p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer transition-all hover:scale-105 active:scale-95 group shadow-2xs"
            id="admin-account-avatar-btn"
            aria-label="Toggle user account menu"
            [title]="userName() + ' (' + userEmail() + ')'"
            [attr.aria-expanded]="isProfileMenuOpen()"
          >
            <!-- Circular Avatar Only (matching design) -->
            <div class="relative size-10 rounded-full p-0.5 ring-2 ring-slate-200/90 dark:ring-slate-700/80 group-hover:ring-indigo-500 dark:group-hover:ring-indigo-400 transition-all bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
              <img
                [src]="userAvatar()"
                [alt]="userName()"
                class="w-full h-full rounded-full object-cover"
              />
            </div>
            <span class="sr-only">{{ userName() }} {{ userEmail() }}</span>
          </button>

          <!-- Profile Dropdown Menu (Solid 100% Opaque, System-Specific Actions) -->
          @if (isProfileMenuOpen()) {
            <div
              class="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] z-[100] p-1.5 animate-fadeIn"
              id="admin-profile-dropdown"
              role="menu"
            >
              <!-- User Info Card Header -->
              <div class="px-3.5 py-3 mb-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 flex items-center gap-3">
                <div class="relative size-10 rounded-full p-0.5 ring-2 ring-indigo-500/30 dark:ring-indigo-400/30 shrink-0 overflow-hidden bg-white dark:bg-slate-900">
                  <img
                    [src]="userAvatar()"
                    [alt]="userName()"
                    class="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div class="flex flex-col min-w-0 text-left">
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ userName() }}</span>
                    <span class="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">Admin</span>
                  </div>
                  <span class="text-[11px] font-normal text-slate-500 dark:text-slate-400 truncate mt-0.5 font-sans tracking-tight">{{ userEmail() }}</span>
                </div>
              </div>

              <!-- Menu Groups (My Account, Portfolio CMS, Appearance, Session) -->
              @for (group of accountMenuItems; track $index) {
                @if (group.separator) {
                  <div class="my-1 border-t border-slate-100 dark:border-slate-800"></div>
                } @else if (group.items && group.items.length > 0) {
                  <div class="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500" [class.font-khmer]="isKhmer()">
                    {{ group.label }}
                  </div>
                  @for (item of group.items; track item.label) {
                    <button
                      type="button"
                      (click)="onMenuItemClick(item)"
                      class="w-full flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left focus:outline-none group/item"
                      [class.hover:!text-rose-600]="item.icon === 'pi pi-sign-out'"
                      [class.dark:hover:!text-rose-400]="item.icon === 'pi pi-sign-out'"
                      [class.hover:!bg-rose-50]="item.icon === 'pi pi-sign-out'"
                      [class.dark:hover:!bg-rose-950/40]="item.icon === 'pi pi-sign-out'"
                      [class.font-khmer]="isKhmer()"
                    >
                      <div class="flex items-center gap-2.5 min-w-0">
                        <i [class]="item.icon" class="text-xs text-slate-400 dark:text-slate-500 group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 w-4 text-center shrink-0 transition-colors" [class.group-hover/item:!text-rose-600]="item.icon === 'pi pi-sign-out'"></i>
                        <span class="truncate">{{ item.label }}</span>
                      </div>
                      @if (item.badge) {
                        <span class="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-2xs">
                          {{ item.badge }}
                        </span>
                      }
                    </button>
                  }
                }
              }
            </div>
          }
        </div>
      </div>
    </header>
  `,
})
export class AdminHeaderComponent implements OnInit {
  public readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly portfolioService = inject(PortfolioService, { optional: true });
  public readonly themeService = inject(ThemeService, { optional: true });
  public readonly languageService = inject(LanguageService);
  public readonly isKhmer = this.languageService.isKhmer;

  @Input() public isCollapsed = false;
  @Output() public toggleSidebar = new EventEmitter<void>();
  @Output() public toggleCollapse = new EventEmitter<void>();

  public readonly isNotificationsOpen = signal<boolean>(false);
  public readonly isProfileMenuOpen = signal<boolean>(false);
  public readonly unreadCount = signal<number>(0);
  public readonly recentMessages = signal<Message[]>([]);
  public accountMenuItems: MenuItem[] = [];

  constructor() {
    effect(() => {
      this.initAccountMenu(this.isKhmer());
    });
  }

  public ngOnInit(): void {
    this.initAccountMenu(this.isKhmer());
    this.loadNotifications();
  }

  public loadNotifications(): void {
    if (!this.portfolioService) {
      return;
    }

    this.portfolioService
      .getDashboardStats()
      .pipe(catchError(() => of(null)))
      .subscribe({
        next: (res) => {
          if (res?.data?.unreadMessages !== undefined) {
            this.unreadCount.set(res.data.unreadMessages);
          }
        },
      });

    this.portfolioService
      .getAdminMessages({ page: 1, limit: 4, isRead: false })
      .pipe(catchError(() => of(null)))
      .subscribe({
        next: (res) => {
          if (res?.data?.items) {
            this.recentMessages.set(res.data.items);
          }
        },
      });
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const target = event.target as Element | null;
    if (
      this.isNotificationsOpen() &&
      target &&
      !target.closest('#admin-notifications-btn') &&
      !target.closest('#admin-notifications-dropdown')
    ) {
      this.isNotificationsOpen.set(false);
    }
    if (
      this.isProfileMenuOpen() &&
      target &&
      !target.closest('#admin-account-avatar-btn') &&
      !target.closest('#admin-profile-dropdown')
    ) {
      this.isProfileMenuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  public onEscapeKey(): void {
    this.isNotificationsOpen.set(false);
    this.isProfileMenuOpen.set(false);
  }

  public toggleProfileMenu(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    const next = !this.isProfileMenuOpen();
    this.isProfileMenuOpen.set(next);
    if (next) {
      this.isNotificationsOpen.set(false);
    }
  }

  public closeProfileMenu(): void {
    this.isProfileMenuOpen.set(false);
  }

  public onMenuItemClick(item: MenuItem): void {
    this.closeProfileMenu();
    if (item.command) {
      item.command({ item });
    }
  }

  public toggleNotifications(): void {
    const next = !this.isNotificationsOpen();
    this.isNotificationsOpen.set(next);
    if (next) {
      this.isProfileMenuOpen.set(false);
      this.loadNotifications();
    }
  }

  public closeNotifications(): void {
    this.isNotificationsOpen.set(false);
  }

  public markAllAsRead(): void {
    const msgs = this.recentMessages();
    if (this.portfolioService && msgs.length > 0) {
      msgs.forEach((m) => {
        if (m._id) {
          this.portfolioService?.markAdminMessageAsRead(m._id)
            .pipe(catchError(() => of(null)))
            .subscribe();
        }
      });
    }
    this.unreadCount.set(0);
    this.recentMessages.set([]);
  }

  public formatTimeAgo(dateInput: string | Date | undefined): string {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const kh = this.isKhmer();
    if (diffMins < 1) return kh ? 'អម្បាញ់មិញ' : 'Just now';
    if (diffMins < 60) return kh ? `${diffMins} នាទីមុន` : `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return kh ? `${diffHours} ម៉ោងមុន` : `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return kh ? `${diffDays} ថ្ងៃមុន` : `${diffDays}d ago`;
  }

  public userName(): string {
    return this.authService.currentUser()?.fullName || 'Administrator';
  }

  public userEmail(): string {
    return this.authService.currentUser()?.email || 'admin@portfolio.dev';
  }

  public userInitials(): string {
    const name = this.userName();
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name[0] || 'A').toUpperCase();
  }

  public userAvatar(): string {
    const user = this.authService.currentUser();
    return user?.avatar || 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png';
  }

  public onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/login');
      },
      error: () => {
        this.router.navigateByUrl('/admin/login');
      },
    });
  }

  public initAccountMenu(kh = false): void {
    this.accountMenuItems = [
      {
        label: kh ? 'គណនី & ប្រវត្តិរូប' : 'My Account',
        items: [
          {
            label: kh ? 'ព័ត៌មានផ្ទាល់ខ្លួន' : 'Profile & Bio',
            icon: 'pi pi-user',
            command: () => {
              this.router.navigate(['/admin/profile']);
            },
          },
          {
            label: kh ? 'គ្រប់គ្រង CV & ប្រវត្តិរូបសង្ខេប' : 'CV / Resume Manager',
            icon: 'pi pi-file',
            command: () => {
              this.router.navigate(['/admin/cv']);
            },
          },
          {
            label: kh ? 'ការកំណត់ប្រព័ន្ធ' : 'System Settings',
            icon: 'pi pi-cog',
            command: () => {
              this.router.navigate(['/admin/settings']);
            },
          },
        ],
      },
      { separator: true },
      {
        label: kh ? 'សម័យការ & គេហទំព័រ' : 'Session',
        items: [
          {
            label: kh ? 'មើលគេហទំព័រផ្ទាល់' : 'View Live Portfolio',
            icon: 'pi pi-external-link',
            command: () => {
              window.open('/', '_blank');
            },
          },
          {
            label: kh ? 'ចាកចេញពីប្រព័ន្ធ' : 'Sign Out / Logout',
            icon: 'pi pi-sign-out',
            command: () => {
              this.onLogout();
            },
          },
        ],
      },
    ];
  }

  public setSystemTheme(): void {
    try {
      localStorage.removeItem('portfolio_theme');
      const isSystemDark =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.themeService?.setTheme(isSystemDark ? 'dark' : 'light');
    } catch {
      this.themeService?.setTheme('light');
    }
  }

  public playNotificationSound(): void {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {
      // Audio playback unavailable or blocked by autoplay
    }
  }
}
