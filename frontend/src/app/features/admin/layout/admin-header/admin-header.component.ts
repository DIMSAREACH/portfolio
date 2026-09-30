import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  template: `
    <header class="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors duration-300">
      <!-- Left: Mobile Menu Toggle & Title -->
      <div class="flex items-center gap-3">
        <button
          type="button"
          (click)="toggleSidebar.emit()"
          class="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
          id="admin-sidebar-toggle-btn"
          aria-label="Toggle navigation sidebar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div class="flex items-center gap-2">
          <span class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Control Center
          </span>
        </div>
      </div>

      <!-- Right: Theme, User Info, Logout -->
      <div class="flex items-center gap-3 sm:gap-4">
        <!-- Theme Toggle -->
        <app-theme-toggle></app-theme-toggle>

        <div class="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

        <!-- User Info & Avatar -->
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {{ userInitials() }}
          </div>

          <div class="hidden sm:block text-left">
            <p class="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              {{ userName() }}
            </p>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              {{ userEmail() }}
            </p>
          </div>
        </div>

        <!-- Logout Button -->
        <button
          type="button"
          (click)="onLogout()"
          [disabled]="authService.isLoading()"
          class="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 transition-colors flex items-center gap-1.5 focus:outline-none"
          id="admin-logout-btn"
          aria-label="Sign out of admin session"
          title="Sign out of admin session"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  `,
})
export class AdminHeaderComponent {
  public readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @Output() public toggleSidebar = new EventEmitter<void>();

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
}
