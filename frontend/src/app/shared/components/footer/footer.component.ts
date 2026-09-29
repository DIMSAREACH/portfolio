import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';

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
    <footer
      class="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-300"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <!-- Col 1: Brand & Bio -->
          <div class="md:col-span-2 space-y-3">
            <div class="flex items-center gap-2">
              <div
                class="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-base shadow-sm"
              >
                S
              </div>
              <span class="text-lg font-bold text-slate-900 dark:text-white">
                Sareach<span class="text-indigo-600 dark:text-indigo-400">.dev</span>
              </span>
            </div>

            <p
              class="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed"
              [class.font-khmer]="isKhmer()"
            >
              {{
                isKhmer()
                  ? 'អ្នកអភិវឌ្ឍន៍ Full Stack និងវិស្វករកម្មវិធីដែលមានចំណង់ចំណូលចិត្តក្នុងការបង្កើតដំណោះស្រាយឌីជីថលទំនើប។'
                  : 'Full Stack Developer passionate about crafting performant web applications, elegant architectures, and delightful user experiences.'
              }}
            </p>
          </div>

          <!-- Col 2: Navigation Links -->
          <div class="space-y-3">
            <h4
              class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
              [class.font-khmer]="isKhmer()"
            >
              {{ isKhmer() ? 'តំណភ្ជាប់រហ័ស' : 'Quick Links' }}
            </h4>
            <ul class="space-y-2 text-sm">
              <li>
                <a
                  routerLink="/projects"
                  class="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {{ isKhmer() ? 'គម្រោង' : 'Projects' }}
                </a>
              </li>
              <li>
                <a
                  routerLink="/blog"
                  class="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {{ isKhmer() ? 'ប្លុក' : 'Blog' }}
                </a>
              </li>
              <li>
                <a
                  routerLink="/about"
                  class="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {{ isKhmer() ? 'អំពីខ្ញុំ' : 'About Me' }}
                </a>
              </li>
              <li>
                <a
                  routerLink="/contact"
                  class="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {{ isKhmer() ? 'ទំនាក់ទំនង' : 'Contact' }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Col 3: Social & Connect -->
          <div class="space-y-3">
            <h4
              class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
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
                  class="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:scale-105 transition-all shadow-sm"
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
          class="pt-8 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400"
        >
          <p>
            &copy; {{ currentYear }} Dim Sareach. All rights reserved.
          </p>

          <button
            type="button"
            (click)="scrollToTop()"
            class="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:underline"
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
    </footer>
  `,
})
export class FooterComponent {
  private readonly languageService = inject(LanguageService);

  public readonly isKhmer = this.languageService.isKhmer;
  public readonly currentYear = new Date().getFullYear();

  public readonly socialLinks: SocialLink[] = [
    {
      platform: 'GitHub',
      url: 'https://github.com',
      ariaLabel: 'GitHub profile',
      iconPath:
        'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z',
    },
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com',
      ariaLabel: 'LinkedIn profile',
      iconPath:
        'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
    },
    {
      platform: 'Telegram',
      url: 'https://t.me',
      ariaLabel: 'Telegram contact',
      iconPath:
        'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.939z',
    },
  ];

  public scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
