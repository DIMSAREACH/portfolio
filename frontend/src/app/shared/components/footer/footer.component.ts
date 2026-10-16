import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { LanguageService } from '../../../core/services/language.service';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { Profile, SocialLink as BackendSocialLink } from '../../../core/models';

interface SocialLink {
  platform: string;
  url: string;
  ariaLabel: string;
  iconPath: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="w-full relative transition-colors duration-300">
      <!-- WAVY SECTION DIVIDER -->
      <div class="relative w-full overflow-hidden leading-none select-none pointer-events-none -mb-[1.5px] z-10">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-full h-10 sm:h-14 md:h-18 lg:h-24 block"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <!-- Brand Glow Linear Gradient along Wave Crest -->
            <linearGradient id="footer-wave-crest" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#6366f1" stop-opacity="0.3" />
              <stop offset="35%" stop-color="#8b5cf6" stop-opacity="0.85" />
              <stop offset="70%" stop-color="#ec4899" stop-opacity="0.75" />
              <stop offset="100%" stop-color="#6366f1" stop-opacity="0.3" />
            </linearGradient>

            <!-- Subtle Translucent Indigo Accent Gradient -->
            <linearGradient id="footer-wave-accent" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.14" />
              <stop offset="50%" stop-color="#7c3aed" stop-opacity="0.2" />
              <stop offset="100%" stop-color="#db2777" stop-opacity="0.12" />
            </linearGradient>
          </defs>

          <!-- Layer 1: Subtle drifting ambient glow wave -->
          <path
            class="wave-animated-layer-1"
            fill="url(#footer-wave-accent)"
            d="M-80,42 C160,82 440,15 720,48 C1000,80 1240,18 1520,52 L1520,121 L-80,121 Z"
          />

          <!-- Layer 2: Secondary gentle floating wave layer -->
          <path
            class="wave-animated-layer-2 fill-indigo-500/10 dark:fill-purple-500/15"
            d="M-80,62 C180,22 460,85 720,40 C980,-2 1260,62 1520,32 L1520,121 L-80,121 Z"
          />

          <!-- Layer 3: Solid base wave connecting seamlessly to the footer background -->
          <path
            class="fill-slate-100 dark:fill-slate-900 transition-colors duration-300"
            d="M-80,48 C220,92 520,24 800,62 C1080,100 1300,42 1520,48 L1520,121 L-80,121 Z"
          />

          <!-- Layer 4: Elegant luminous crest stroke matching brand gradient -->
          <path
            stroke="url(#footer-wave-crest)"
            stroke-width="1.75"
            stroke-linecap="round"
            d="M-80,48 C220,92 520,24 800,62 C1080,100 1300,42 1520,48"
          />
        </svg>
      </div>

      <!-- MAIN FOOTER BODY -->
      <div class="w-full bg-slate-100 dark:bg-slate-900 transition-colors duration-300 relative">
        <!-- Ambient Top Glow Glow Accent -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-24 bg-gradient-to-r from-indigo-500/5 via-purple-500/10 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/15 dark:to-pink-500/10 blur-3xl pointer-events-none"></div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <!-- Col 1: Brand & Bio -->
            <div class="md:col-span-2 space-y-3">
              <a
                routerLink="/"
                class="group inline-flex items-center text-decoration-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 rounded-xl transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] select-none"
                aria-label="Dim Sareach Portfolio Home"
              >
                <span
                  class="font-brand text-[1.45rem] sm:text-2xl lg:text-[1.75rem] font-black tracking-tight text-slate-900 dark:text-white transition-colors duration-200"
                  style="font-family: var(--font-brand), 'Outfit', 'Plus Jakarta Sans', sans-serif;"
                >
                  Sareach<span class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent font-black ml-0.5">.dev</span>
                </span>
              </a>

              <p
                class="text-sm text-slate-600 dark:text-slate-300 max-w-sm leading-relaxed"
                [class.font-khmer]="isKhmer()"
              >
                {{
                  (isKhmer() ? profile()?.introduction?.kh : profile()?.introduction?.en) ||
                  (isKhmer()
                    ? 'អ្នកអភិវឌ្ឍន៍ Full Stack និងវិស្វករកម្មវិធីដែលមានចំណង់ចំណូលចិត្តក្នុងការបង្កើតដំណោះស្រាយឌីជីថលទំនើប។'
                    : 'Full Stack Developer passionate about crafting performant web applications, elegant architectures, and delightful user experiences.')
                }}
              </p>
            </div>

            <!-- Col 2: Navigation Links -->
            <div class="space-y-3">
              <h4
                class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                [class.font-khmer]="isKhmer()"
              >
                {{ isKhmer() ? 'តំណភ្ជាប់រហ័ស' : 'Quick Links' }}
              </h4>
              <ul class="space-y-2 text-sm">
                <li>
                  <a
                    routerLink="/projects"
                    class="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                  >
                    {{ isKhmer() ? 'គម្រោង' : 'Projects' }}
                  </a>
                </li>
                <li>
                  <a
                    routerLink="/experience"
                    class="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                  >
                    {{ isKhmer() ? 'បទពិសោធន៍' : 'Experience' }}
                  </a>
                </li>
                <li>
                  <a
                    routerLink="/about"
                    class="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                  >
                    {{ isKhmer() ? 'អំពីខ្ញុំ' : 'About Me' }}
                  </a>
                </li>
                <li>
                  <a
                    routerLink="/contact"
                    class="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                  >
                    {{ isKhmer() ? 'ទំនាក់ទំនង' : 'Contact' }}
                  </a>
                </li>
              </ul>
            </div>

            <!-- Col 3: Social & Connect -->
            <div class="space-y-3">
              <h4
                class="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                [class.font-khmer]="isKhmer()"
              >
                {{ isKhmer() ? 'បណ្ដាញសង្គម' : 'Connect' }}
              </h4>
              <div class="flex items-center gap-3">
                @for (social of socialLinks; track social.platform) {
                  <a
                    [href]="social.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    [attr.aria-label]="social.ariaLabel"
                    class="p-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500 hover:scale-105 transition-all shadow-xs"
                  >
                    <svg
                      class="w-4 h-4 fill-currentColor"
                      viewBox="0 0 24 24"
                      [attr.d]="social.iconPath"
                    >
                      <path [attr.d]="social.iconPath" />
                    </svg>
                  </a>
                }
              </div>
            </div>
          </div>

          <!-- Bottom Bar -->
          <div
            class="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400"
          >
            <p>
              &copy; {{ currentYear }} {{ (isKhmer() ? profile()?.fullName?.kh : profile()?.fullName?.en) || 'Dim Sareach' }}. All rights reserved.
            </p>

            <button
              type="button"
              (click)="scrollToTop()"
              class="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors focus:outline-none focus:underline cursor-pointer"
              id="back-to-top-btn"
            >
              <span>{{ isKhmer() ? 'ទៅលើបង្អស់' : 'Back to top' }}</span>
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    @keyframes waveFlow1 {
      0% {
        transform: translate3d(0, 0, 0);
      }
      50% {
        transform: translate3d(-35px, 2px, 0);
      }
      100% {
        transform: translate3d(0, 0, 0);
      }
    }

    @keyframes waveFlow2 {
      0% {
        transform: translate3d(0, 0, 0);
      }
      50% {
        transform: translate3d(30px, -2px, 0);
      }
      100% {
        transform: translate3d(0, 0, 0);
      }
    }

    .wave-animated-layer-1 {
      animation: waveFlow1 12s ease-in-out infinite alternate;
      will-change: transform;
    }

    .wave-animated-layer-2 {
      animation: waveFlow2 16s ease-in-out infinite alternate;
      will-change: transform;
    }

    @media (prefers-reduced-motion: reduce) {
      .wave-animated-layer-1,
      .wave-animated-layer-2 {
        animation: none !important;
      }
    }
  `],
})
export class FooterComponent implements OnInit {
  private readonly languageService = inject(LanguageService);
  private readonly portfolioService = inject(PortfolioService, { optional: true });

  public readonly isKhmer = this.languageService.isKhmer;
  public readonly currentYear = new Date().getFullYear();
  public readonly profile = signal<Profile | null>(null);

  public socialLinks: SocialLink[] = [
    {
      platform: 'GitHub',
      url: 'https://github.com/dimsareach',
      ariaLabel: 'GitHub profile',
      iconPath:
        'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z',
    },
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/dimsareach',
      ariaLabel: 'LinkedIn profile',
      iconPath:
        'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
    },
    {
      platform: 'Telegram',
      url: 'https://t.me/dimsareach',
      ariaLabel: 'Telegram contact',
      iconPath:
        'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.939z',
    },
  ];

  public ngOnInit(): void {
    if (this.portfolioService) {
      this.portfolioService
        .getSocialLinks()
        .pipe(catchError(() => of(null)))
        .subscribe((res) => {
          if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
            this.socialLinks = res.data.map((item: BackendSocialLink) => ({
              platform: item.label || item.platform,
              url: item.url,
              ariaLabel: `${item.label || item.platform} profile`,
              iconPath: this.getIconPath(item.platform),
            }));
          }
        });

      this.portfolioService
        .getProfile()
        .pipe(catchError(() => of(null)))
        .subscribe((res) => {
          if (res?.data) {
            this.profile.set(res.data);
          }
        });
    }
  }

  private getIconPath(platform: string): string {
    const p = (platform || '').toLowerCase();
    if (p.includes('git')) {
      return 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z';
    }
    if (p.includes('link')) {
      return 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z';
    }
    if (p.includes('tele')) {
      return 'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.939z';
    }
    return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z';
  }

  public scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
