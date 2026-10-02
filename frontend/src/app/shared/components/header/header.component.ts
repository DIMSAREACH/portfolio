import { Component, HostListener, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { LanguageService } from '../../../core/services/language.service';
import { PortfolioService } from '../../../core/services/portfolio.service';

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
      class="w-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/70 dark:border-slate-800/70 transition-all duration-300 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.25)]"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4"
      >
        <!-- Logo / Brand -->
        <a
          routerLink="/"
          class="flex items-center gap-2.5 group text-decoration-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40 rounded-xl p-1"
          aria-label="Portfolio Home"
        >
          <div
            class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-indigo-500/25 group-hover:scale-105 group-hover:shadow-indigo-500/40 ring-1 ring-white/20 transition-all"
          >
            S
          </div>
          <span
            class="text-lg font-black tracking-tight text-slate-900 dark:text-white"
          >
            Sareach<span class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-extrabold">.dev</span>
          </span>
        </a>

        <!-- Desktop Navigation Links with Cool Underline -->
        <nav
          class="hidden md:flex items-center gap-1 lg:gap-1.5"
          aria-label="Desktop Navigation"
        >
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="active-nav-link"
              [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
              class="nav-link"
              [class.font-khmer]="isKhmer()"
            >
              <span>{{ isKhmer() ? item.labelKh : item.labelEn }}</span>
            </a>
          }
        </nav>

        <!-- Right Side Controls (Resume, Language, Theme, Mobile Toggle) -->
        <div class="flex items-center gap-2 sm:gap-2.5">
          <a
            [href]="cvDownloadUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/60 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white dark:hover:text-white border border-indigo-200/80 dark:border-indigo-800/80 hover:border-transparent transition-all shadow-xs hover:shadow-indigo-500/25 hover:scale-105 active:scale-95"
            id="header-cv-btn"
            title="Download CV"
          >
            <i class="pi pi-download text-xs"></i>
            <span>{{ isKhmer() ? 'ប្រវត្តិរូប' : 'Resume' }}</span>
          </a>

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
          class="md:hidden border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-1 shadow-2xl transition-all"
          id="mobile-navigation"
        >
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              (click)="closeMobileMenu()"
              routerLinkActive="active-nav-link"
              [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
              class="mobile-nav-link block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              [class.font-khmer]="isKhmer()"
            >
              {{ isKhmer() ? item.labelKh : item.labelEn }}
            </a>
          }

          <div class="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800">
            <a
              [href]="cvDownloadUrl"
              target="_blank"
              rel="noopener noreferrer"
              (click)="closeMobileMenu()"
              class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md shadow-indigo-500/25"
              id="mobile-cv-btn"
            >
              <i class="pi pi-download text-xs"></i>
              <span>{{ isKhmer() ? 'ទាញយកប្រវត្តិរូប (CV)' : 'Download Resume' }}</span>
            </a>
          </div>
        </div>
      }
    </header>
  `,
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly languageService = inject(LanguageService);
  private readonly portfolioService = inject(PortfolioService, { optional: true });

  public readonly isKhmer = this.languageService.isKhmer;
  public readonly isScrolled = signal(false);
  public isMobileMenuOpen = false;

  @HostListener('window:scroll')
  public onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      this.isScrolled.set(scrollY > 10);
    }
  }

  public get cvDownloadUrl(): string {
    return this.portfolioService?.getCvDownloadUrl() ?? '/api/v1/cv/download';
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

  public toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  public closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
