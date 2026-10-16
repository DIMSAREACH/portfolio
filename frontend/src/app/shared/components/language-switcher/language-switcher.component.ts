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
      (click)="onTrackClick($event)"
      (keydown)="onTrackKeydown($event)"
    >
      <!-- Hardware-accelerated sliding glider pill -->
      <span
        class="lang-glider"
        [class.slide-kh]="currentLang() === 'kh'"
        aria-hidden="true"
      ></span>

      <button
        type="button"
        (click)="selectLanguage('en', $event)"
        class="lang-btn"
        [class.active]="currentLang() === 'en'"
        aria-label="Switch to English"
        [attr.aria-pressed]="currentLang() === 'en'"
      >
        EN
      </button>

      <button
        type="button"
        (click)="selectLanguage('kh', $event)"
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
        grid-template-columns: repeat(2, minmax(42px, 1fr));
        align-items: center;
        height: 36px;
        box-sizing: border-box;
        padding: 3px;
        border-radius: 9999px;
        background-color: #f1f5f9;
        border: 1px solid rgba(226, 232, 240, 0.9);
        gap: 4px;
        user-select: none;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
        cursor: pointer;
        transition: background-color 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),
                    border-color 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),
                    box-shadow 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),
                    transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1);
        -webkit-tap-highlight-color: transparent;
      }

      .lang-switch-track:active {
        transform: scale(0.97);
      }

      :host-context(.dark) .lang-switch-track {
        background-color: #1e293b;
        border-color: rgba(51, 65, 85, 0.9);
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.35);
      }

      /* Sliding Pill Glider: Emerald pill with concentric double ring */
      .lang-glider {
        position: absolute;
        top: 3px;
        bottom: 3px;
        left: 3px;
        width: calc((100% - 10px) / 2);
        border-radius: 9999px;
        background: linear-gradient(135deg, #059669 0%, #047857 100%);
        box-shadow: 0 0 0 1.5px #ffffff, 0 0 0 3px #059669;
        pointer-events: none;
        z-index: 1;
        transform: translate3d(0, 0, 0);
        transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),
                    box-shadow 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
        will-change: transform;
      }

      :host-context(.dark) .lang-glider {
        background: linear-gradient(135deg, #059669 0%, #047857 100%);
        box-shadow: 0 0 0 1.5px #0f172a, 0 0 0 3px #059669;
      }

      /* Smooth glide to Khmer (2nd button position) */
      .lang-glider.slide-kh {
        transform: translate3d(calc(100% + 4px), 0, 0);
      }

      .lang-btn {
        position: relative;
        z-index: 2;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 42px;
        height: 28px;
        padding: 0 10px;
        font-size: 0.75rem;
        font-weight: 700;
        line-height: 1;
        border-radius: 9999px;
        color: #475569;
        background: transparent;
        border: none;
        cursor: pointer;
        transition: color 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),
                    opacity 0.2s ease;
        will-change: color;
        outline: none;
      }

      .lang-btn:focus-visible {
        outline: 2px solid #059669;
        outline-offset: 2px;
      }

      .lang-btn.font-khmer {
        font-family: var(--font-khmer), 'Noto Sans Khmer', sans-serif;
        font-size: 0.8125rem;
        letter-spacing: 0.01em;
        line-height: 1.25;
        padding-top: 1px;
      }

      .lang-btn:hover:not(.active) {
        color: #0f172a;
      }

      :host-context(.dark) .lang-btn {
        color: #94a3b8;
      }

      :host-context(.dark) .lang-btn:hover:not(.active) {
        color: #f8fafc;
      }

      /* Active State: text turns crisp white smoothly above the glider */
      .lang-btn.active {
        color: #ffffff !important;
        font-weight: 700;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
      }

      :host-context(.dark) .lang-btn.active {
        color: #ffffff !important;
      }

      @media (prefers-reduced-motion: reduce) {
        .lang-glider,
        .lang-switch-track {
          transition: none !important;
        }
      }
    `,
  ],
})
export class LanguageSwitcherComponent {
  private readonly languageService = inject(LanguageService);

  public readonly currentLang = this.languageService.currentLang;

  public selectLanguage(lang: SupportedLanguage, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.currentLang() !== lang) {
      this.languageService.setLanguage(lang);
    }
  }

  public onTrackClick(event: MouseEvent): void {
    const track = event.currentTarget as HTMLElement;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    this.selectLanguage(clickX > rect.width / 2 ? 'kh' : 'en');
  }

  public onTrackKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleLanguage();
    }
  }

  public toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }
}
