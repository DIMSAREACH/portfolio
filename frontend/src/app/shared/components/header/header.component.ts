import { Component, HostListener, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
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
    ButtonModule,
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

        <!-- Navigation Links with Cool Underline -->
        <nav
          class="flex items-center gap-1 lg:gap-1.5 overflow-x-auto no-scrollbar py-1"
          aria-label="Navigation"
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

        <!-- Right Side Controls (Resume, Language, Theme) -->
        <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <a
            pButton
            rounded
            [href]="cvDownloadUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden lg:inline-flex items-center gap-1.5 !text-xs !py-1.5 !px-4 shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95"
            id="header-cv-btn"
            title="Download CV"
          >
            <i class="pi pi-download text-xs"></i>
            <span>{{ isKhmer() ? 'ប្រវត្តិរូប' : 'Resume' }}</span>
          </a>

          <app-language-switcher></app-language-switcher>
          <app-theme-toggle></app-theme-toggle>
        </div>
      </div>
    </header>
  `,
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private readonly languageService = inject(LanguageService);
  private readonly portfolioService = inject(PortfolioService, { optional: true });

  public readonly isKhmer = this.languageService.isKhmer;
  public readonly isScrolled = signal(false);

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
}
