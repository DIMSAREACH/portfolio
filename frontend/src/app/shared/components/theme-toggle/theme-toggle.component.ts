import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <button
      pButton
      rounded
      severity="secondary"
      type="button"
      (click)="toggleTheme()"
      [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
      class="!w-9 !h-9 !p-0 flex items-center justify-center !rounded-full border border-slate-200/80 dark:border-slate-700/80 transition-all duration-300 shadow-2xs hover:scale-105 active:scale-95"
      id="theme-toggle-btn"
    >
      @if (isDark()) {
        <i class="pi pi-sun text-amber-400 text-base transition-transform duration-300 hover:rotate-45"></i>
      } @else {
        <i class="pi pi-moon text-slate-700 dark:text-slate-200 text-base transition-transform duration-300 hover:-rotate-12"></i>
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
