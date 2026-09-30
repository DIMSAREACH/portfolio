import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { LanguageService } from '../../../core/services/language.service';

interface NavItem {
  path: string;
  labelEn: string;
  labelKh: string;
  exact?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ThemeToggleComponent,
    LanguageSwitcherComponent,
  ],
  template: `
    <header
      class="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4"
      >
        <!-- Logo / Brand -->
        <a
          routerLink="/"
          class="flex items-center gap-2 group text-decoration-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded-lg p-1"
          aria-label="Portfolio Home"
        >
          <div
            class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform"
          >
            S
          </div>
          <span
            class="text-lg font-bold bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-700 dark:from-white dark:via-indigo-200 dark:to-slate-300 bg-clip-text text-transparent"
          >
            Sareach<span class="text-indigo-600 dark:text-indigo-400">.dev</span>
          </span>
        </a>

        <!-- Desktop Navigation Links -->
        <nav
          class="hidden md:flex items-center gap-1 lg:gap-2"
          aria-label="Desktop Navigation"
        >
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/80 dark:bg-indigo-950/40"
              [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
              class="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all"
              [class.font-khmer]="isKhmer()"
            >
              {{ isKhmer() ? item.labelKh : item.labelEn }}
            </a>
          }
        </nav>

        <!-- Right Side Controls (Theme, Language, Mobile Toggle) -->
        <div class="flex items-center gap-2 sm:gap-3">
          <app-language-switcher></app-language-switcher>
          <app-theme-toggle></app-theme-toggle>

          <!-- Mobile Hamburger Toggle Button -->
          <button
            type="button"
            (click)="toggleMobileMenu()"
            [attr.aria-expanded]="isMobileMenuOpen"
            aria-label="Toggle mobile menu"
            class="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            id="mobile-menu-btn"
          >
            @if (!isMobileMenuOpen) {
              <!-- Hamburger icon -->
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            } @else {
              <!-- Close icon -->
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            }
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown / Drawer Menu -->
      @if (isMobileMenuOpen) {
        <div
          class="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-1.5 shadow-xl transition-all"
          id="mobile-navigation"
        >
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              (click)="closeMobileMenu()"
              routerLinkActive="text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/50"
              [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
              class="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              [class.font-khmer]="isKhmer()"
            >
              {{ isKhmer() ? item.labelKh : item.labelEn }}
            </a>
          }
        </div>
      }
    </header>
  `,
})
export class HeaderComponent {
  private readonly languageService = inject(LanguageService);

  public readonly isKhmer = this.languageService.isKhmer;
  public isMobileMenuOpen = false;

  public readonly navItems: NavItem[] = [
    { path: '/', labelEn: 'Home', labelKh: 'ទំព័រដើម', exact: true },
    { path: '/about', labelEn: 'About', labelKh: 'អំពីខ្ញុំ' },
    { path: '/skills', labelEn: 'Skills', labelKh: 'ជំនាញ' },
    { path: '/experience', labelEn: 'Experience', labelKh: 'បទពិសោធន៍' },
    { path: '/education', labelEn: 'Education', labelKh: 'ការអប់រំ' },
    { path: '/projects', labelEn: 'Projects', labelKh: 'គម្រោង' },
    { path: '/blog', labelEn: 'Blog', labelKh: 'ប្លុក' },
    { path: '/achievements', labelEn: 'Achievements', labelKh: 'សមិទ្ធផល' },
    { path: '/contact', labelEn: 'Contact', labelKh: 'ទំនាក់ទំនង' },
  ];

  public toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  public closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
