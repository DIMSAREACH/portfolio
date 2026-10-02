import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import {
  LanguageService,
  SupportedLanguage,
} from '../../../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div
      class="inline-flex items-center p-0.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 shadow-2xs gap-0.5"
      role="group"
      aria-label="Language selector"
    >
      <button
        pButton
        rounded
        [severity]="currentLang() === 'en' ? undefined : 'secondary'"
        [text]="currentLang() !== 'en'"
        type="button"
        (click)="selectLanguage('en')"
        class="!px-2.5 !py-1 !text-xs !font-bold transition-all !rounded-full"
        aria-label="Switch to English"
        [attr.aria-pressed]="currentLang() === 'en'"
      >
        EN
      </button>

      <button
        pButton
        rounded
        [severity]="currentLang() === 'kh' ? undefined : 'secondary'"
        [text]="currentLang() !== 'kh'"
        type="button"
        (click)="selectLanguage('kh')"
        class="!px-2.5 !py-1 !text-xs !font-bold transition-all font-khmer !rounded-full"
        aria-label="Switch to Khmer"
        [attr.aria-pressed]="currentLang() === 'kh'"
      >
        ខ្មែរ
      </button>
    </div>
  `,
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
