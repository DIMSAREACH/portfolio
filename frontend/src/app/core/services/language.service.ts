import { Injectable, signal, computed, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BilingualField, BilingualArrayField } from '../models';

export type SupportedLanguage = 'en' | 'kh';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'portfolio_lang';

  /**
   * Signal holding currently active language code ('en' or 'kh')
   */
  public readonly currentLang = signal<SupportedLanguage>('en');

  /**
   * Computed boolean checking if current language is Khmer
   */
  public readonly isKhmer = computed<boolean>(() => this.currentLang() === 'kh');

  constructor() {
    this.initializeLanguage();
  }

  /**
   * Switch active language
   */
  public setLanguage(lang: SupportedLanguage): void {
    this.currentLang.set(lang);
    this.applyLanguage(lang);

    try {
      localStorage.setItem(this.storageKey, lang);
    } catch {
      /* ignore */
    }
  }

  /**
   * Toggle between English and Khmer
   */
  public toggleLanguage(): void {
    const nextLang: SupportedLanguage = this.currentLang() === 'en' ? 'kh' : 'en';
    this.setLanguage(nextLang);
  }

  /**
   * Helper to retrieve localized value from a bilingual text field
   */
  public getLocalizedText(field?: BilingualField | null): string {
    if (!field) {
      return '';
    }
    const lang = this.currentLang();
    return field[lang] || field.en || '';
  }

  /**
   * Helper to retrieve localized array of strings from a bilingual array field
   */
  public getLocalizedArray(field?: BilingualArrayField | null): string[] {
    if (!field) {
      return [];
    }
    const lang = this.currentLang();
    return field[lang]?.length ? field[lang] : field.en || [];
  }

  /**
   * Initialize language from localStorage or default to English
   */
  private initializeLanguage(): void {
    let initialLang: SupportedLanguage = 'en';

    try {
      const savedLang = localStorage.getItem(this.storageKey) as SupportedLanguage | null;
      if (savedLang === 'en' || savedLang === 'kh') {
        initialLang = savedLang;
      }
    } catch {
      initialLang = 'en';
    }

    this.currentLang.set(initialLang);
    this.applyLanguage(initialLang);
  }

  /**
   * Update HTML lang attribute on document
   */
  private applyLanguage(lang: SupportedLanguage): void {
    if (this.document?.documentElement) {
      this.document.documentElement.lang = lang;
    }
  }
}
