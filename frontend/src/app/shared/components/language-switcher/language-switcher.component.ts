import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LanguageService,
  SupportedLanguage,
} from '../../../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="lang-switch-track"
      role="group"
      aria-label="Language selector"
    >
      <!-- Hardware-accelerated sliding glider pill -->
      <span
        class="lang-glider"
        [class.slide-kh]="currentLang() === 'kh'"
        aria-hidden="true"
      ></span>

      <button
        type="button"
        (click)="selectLanguage('en')"
        class="lang-btn"
        [class.active]="currentLang() === 'en'"
        aria-label="Switch to English"
        [attr.aria-pressed]="currentLang() === 'en'"
      >
        EN
      </button>

      <button
        type="button"
        (click)="selectLanguage('kh')"
        class="lang-btn font-khmer"
        [class.active]="currentLang() === 'kh'"
        aria-label="Switch to Khmer"
        [attr.aria-pressed]="currentLang() === 'kh'"
      >
        ខ្មែរ
      </button>
    </div>
  `,
  styles: [
    `
      .lang-switch-track {
        position: relative;
        display: inline-grid;
        grid-template-columns: repeat(2, minmax(38px, 1fr));
        align-items: center;
        padding: 3px;
        border-radius: 9999px;
        background-color: #f1f5f9;
        border: 1px solid rgba(226, 232, 240, 0.9);
        gap: 3px;
        user-select: none;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
        transition: background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                    border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                    box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }

      :host-context(.dark) .lang-switch-track {
        background-color: #1e293b;
        border-color: rgba(51, 65, 85, 0.9);
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
      }

      /* Sliding Pill Glider: Emerald pill with concentric double ring */
      .lang-glider {
        position: absolute;
        top: 3px;
        bottom: 3px;
        left: 3px;
        width: calc((100% - 9px) / 2);
        border-radius: 9999px;
        background-color: #059669;
        box-shadow: 0 0 0 2px #ffffff, 0 0 0 3.5px #059669;
        pointer-events: none;
        z-index: 1;
        transition: transform 0.34s cubic-bezier(0.34, 1.56, 0.64, 1),
                    box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: transform;
      }

      :host-context(.dark) .lang-glider {
        background-color: #059669;
        box-shadow: 0 0 0 2px #0f172a, 0 0 0 3.5px #059669;
      }

      /* Smooth glide to Khmer (2nd button position) */
      .lang-glider.slide-kh {
        transform: translateX(calc(100% + 3px));
      }

      .lang-btn {
        position: relative;
        z-index: 2;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 38px;
        padding: 4px 10px;
        font-size: 0.75rem;
        font-weight: 700;
        line-height: 1;
        border-radius: 9999px;
        color: #475569;
        background: transparent;
        border: none;
        cursor: pointer;
        transition: color 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                    transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: color, transform;
      }

      .lang-btn:hover {
        color: #0f172a;
      }

      .lang-btn:active {
        transform: scale(0.94);
      }

      :host-context(.dark) .lang-btn {
        color: #94a3b8;
      }

      :host-context(.dark) .lang-btn:hover {
        color: #ffffff;
      }

      /* Active State: text turns bold white smoothly above the glider */
      .lang-btn.active {
        color: #ffffff !important;
        font-weight: 800;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      }

      :host-context(.dark) .lang-btn.active {
        color: #ffffff !important;
      }

      @media (prefers-reduced-motion: reduce) {
        .lang-glider {
          transition: none !important;
        }
      }
    `,
  ],
})
export class LanguageSwitcherComponent {
  private readonly languageService = inject(LanguageService);

  public readonly currentLang = this.languageService.currentLang;

  public selectLanguage(lang: SupportedLanguage): void {
    if (this.currentLang() !== lang) {
      this.languageService.setLanguage(lang);
    }
  }

  public toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
}
