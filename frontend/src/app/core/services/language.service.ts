import { Injectable, signal, computed, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { BilingualField, BilingualArrayField } from '../models';
import enTranslations from '../../../assets/i18n/en.json';
import khTranslations from '../../../assets/i18n/kh.json';

export type SupportedLanguage = 'en' | 'kh';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly translateService = inject(TranslateService, { optional: true });
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
    this.setupTranslations();
    this.initializeLanguage();
  }

  /**
   * Setup initial translations in ngx-translate
   */
  private setupTranslations(): void {
    if (this.translateService) {
      this.translateService.setTranslation('en', enTranslations, true);
      this.translateService.setTranslation('kh', khTranslations, true);
      this.translateService.setFallbackLang('en');
    }
  }

  /**
   * Switch active language
   */
  public setLanguage(lang: SupportedLanguage): void {
    this.currentLang.set(lang);
    this.applyLanguage(lang);
    if (this.translateService) {
      this.translateService.use(lang);
    }

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
    if (this.translateService) {
      this.translateService.use(initialLang);
    }
  }

  /**
   * Helper to translate static string using ngx-translate
   */
  public translate(key: string, params?: Record<string, unknown>): string {
    if (!this.translateService) {
      return key;
    }
    const val = this.translateService.instant(key, params);
    return val !== undefined ? val : key;
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
