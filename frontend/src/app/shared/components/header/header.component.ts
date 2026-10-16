import { Component, HostListener, signal, inject } from '@angular/core';
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
      [class.header-scrolled]="isScrolled()"
      class="w-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3)] relative z-50"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4"
      >
        <!-- Brand Name -->
        <a
          routerLink="/"
          (click)="closeMobileMenu()"
          class="group inline-flex items-center text-decoration-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 rounded-xl py-1 px-1 shrink-0 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] select-none"
          aria-label="Dim Sareach Portfolio Home"
        >
          <span
            class="font-brand text-[1.45rem] sm:text-2xl lg:text-[1.75rem] font-black tracking-tight text-slate-900 dark:text-white transition-colors duration-200"
            style="font-family: var(--font-brand), 'Outfit', 'Plus Jakarta Sans', sans-serif;"
          >
            Sareach<span class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent font-black ml-0.5">.dev</span>
          </span>
        </a>

        <!-- Desktop Navigation Links (Visible on Large Screens >= 1024px) -->
        <nav
          class="hidden lg:flex items-center gap-1 xl:gap-1.5 py-1"
          aria-label="Desktop Navigation"
        >
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="active-nav-link"
              [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
              class="nav-link whitespace-nowrap"
              [class.font-khmer]="isKhmer()"
            >
              <span>{{ isKhmer() ? item.labelKh : item.labelEn }}</span>
            </a>
          }
        </nav>

        <!-- Right Side Controls (Language, Theme, and Mobile Menu Toggle) -->
        <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <!-- Language Switcher (hidden on extra small screens, rendered inside mobile drawer) -->
          <app-language-switcher class="hidden sm:inline-block"></app-language-switcher>

          <!-- Theme Toggle -->
          <app-theme-toggle></app-theme-toggle>

          <!-- Mobile Hamburger Menu Button (Visible on Phone and Tablet < 1024px) -->
          <button
            id="mobile-menu-btn"
            type="button"
            (click)="toggleMobileMenu()"
            [attr.aria-expanded]="isMobileMenuOpen()"
            aria-controls="mobile-menu-drawer"
            aria-label="Toggle navigation menu"
            class="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-600/50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 active:scale-95 shadow-2xs cursor-pointer"
          >
            @if (isMobileMenuOpen()) {
              <!-- Close Icon ✕ -->
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            } @else {
              <!-- Hamburger Icon ☰ -->
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            }
          </button>
        </div>
      </div>

      <!-- Mobile & Tablet Navigation Menu Dropdown Drawer -->
      @if (isMobileMenuOpen()) {
        <div
          id="mobile-menu-drawer"
          class="lg:hidden w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl shadow-2xl animate-fade-in"
        >
          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">
            <!-- Nav Links List -->
            <nav class="flex flex-col space-y-1" aria-label="Mobile Navigation">
              @for (item of navItems; track item.path) {
                <a
                  [routerLink]="item.path"
                  routerLinkActive="active-mobile-link"
                  [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
                  (click)="closeMobileMenu()"
                  class="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/70 dark:hover:bg-slate-800/70 transition-all min-h-[46px]"
                  [class.font-khmer]="isKhmer()"
                >
                  <span>{{ isKhmer() ? item.labelKh : item.labelEn }}</span>
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              }
            </nav>

            <!-- Mobile Controls Bar (Language Switcher on Phone) -->
            <div class="sm:hidden pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/50">
              <span class="text-xs font-bold text-slate-700 dark:text-slate-300">
                {{ isKhmer() ? 'ភាសា' : 'Language' }}
              </span>
              <app-language-switcher></app-language-switcher>
            </div>
          </div>
        </div>
      }
    </header>
  `,
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly languageService = inject(LanguageService);

  public readonly isKhmer = this.languageService.isKhmer;
  public readonly isScrolled = signal(false);
  public readonly isMobileMenuOpen = signal(false);

  @HostListener('window:scroll')
  public onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      this.isScrolled.set(scrollY > 10);
    }
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      this.closeMobileMenu();
    }
  }

  @HostListener('document:keydown.escape')
  public onEscape(): void {
    this.closeMobileMenu();
  }

  public toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  public closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  /**
   * Navigation links without Blog (hidden per request)
   */
  public readonly navItems: NavItem[] = [
    { path: '/', labelEn: 'Home', labelKh: 'ទំព័រដើម', exact: true },
    { path: '/about', labelEn: 'About', labelKh: 'អំពីខ្ញុំ' },
    { path: '/skills', labelEn: 'Skills', labelKh: 'ជំនាញ' },
    { path: '/experience', labelEn: 'Experience', labelKh: 'បទពិសោធន៍' },
    { path: '/education', labelEn: 'Education', labelKh: 'ការអប់រំ' },
    { path: '/projects', labelEn: 'Projects', labelKh: 'គម្រោង' },
    { path: '/achievements', labelEn: 'Achievements', labelKh: 'សមិទ្ធផល' },
    { path: '/contact', labelEn: 'Contact', labelKh: 'ទំនាក់ទំនង' },
  ];
}
