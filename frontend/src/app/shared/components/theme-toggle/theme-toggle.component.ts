import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      (click)="toggleTheme()"
      [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
      class="relative p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200/60 dark:border-slate-700/60"
      id="theme-toggle-btn"
    >
      @if (isDark()) {
        <!-- Sun icon (shown in dark mode) -->
        <svg
          class="w-5 h-5 transition-transform duration-300 rotate-0 hover:rotate-45 text-amber-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      } @else {
        <!-- Moon icon (shown in light mode) -->
        <svg
          class="w-5 h-5 transition-transform duration-300 -rotate-12 hover:rotate-0 text-slate-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      }
    </button>
  `,
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  public readonly isDark = this.themeService.isDark;

  public toggleTheme(): void {
    this.themeService.toggle();
  }
}
