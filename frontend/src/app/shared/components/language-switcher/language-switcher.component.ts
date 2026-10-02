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
        display: inline-flex;
        align-items: center;
        padding: 3px;
        border-radius: 9999px;
        background-color: #f1f5f9;
        border: 1px solid rgba(226, 232, 240, 0.9);
        gap: 3px;
        user-select: none;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
      }

      :host-context(.dark) .lang-switch-track {
        background-color: #1e293b;
        border-color: rgba(51, 65, 85, 0.9);
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
      }

      .lang-btn {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 4px 11px;
        font-size: 0.75rem;
        font-weight: 700;
        line-height: 1;
        border-radius: 9999px;
        color: #475569;
        background: transparent;
        border: none;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .lang-btn:hover {
        color: #0f172a;
      }

      :host-context(.dark) .lang-btn {
        color: #94a3b8;
      }

      :host-context(.dark) .lang-btn:hover {
        color: #ffffff;
      }

      /* Active State: Emerald pill with concentric gap and outer ring matching the user's screenshot */
      .lang-btn.active {
        background-color: #059669;
        color: #ffffff !important;
        font-weight: 800;
        box-shadow: 0 0 0 2px #ffffff, 0 0 0 3.5px #059669;
      }

      :host-context(.dark) .lang-btn.active {
        background-color: #059669;
        color: #ffffff !important;
        box-shadow: 0 0 0 2px #0f172a, 0 0 0 3.5px #059669;
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
