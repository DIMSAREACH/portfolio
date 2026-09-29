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
      class="inline-flex items-center p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        (click)="selectLanguage('en')"
        [class.bg-white]="currentLang() === 'en'"
        [class.text-indigo-600]="currentLang() === 'en'"
        [class.dark:bg-slate-700]="currentLang() === 'en'"
        [class.dark:text-indigo-400]="currentLang() === 'en'"
        [class.shadow-sm]="currentLang() === 'en'"
        [class.text-slate-500]="currentLang() !== 'en'"
        [class.dark:text-slate-400]="currentLang() !== 'en'"
        class="px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        aria-label="Switch to English"
        [attr.aria-pressed]="currentLang() === 'en'"
      >
        EN
      </button>

      <button
        type="button"
        (click)="selectLanguage('kh')"
        [class.bg-white]="currentLang() === 'kh'"
        [class.text-indigo-600]="currentLang() === 'kh'"
        [class.dark:bg-slate-700]="currentLang() === 'kh'"
        [class.dark:text-indigo-400]="currentLang() === 'kh'"
        [class.shadow-sm]="currentLang() === 'kh'"
        [class.text-slate-500]="currentLang() !== 'kh'"
        [class.dark:text-slate-400]="currentLang() !== 'kh'"
        class="px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-khmer"
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
