import { Pipe, PipeTransform, inject } from '@angular/core';
import {
  LanguageService,
  SupportedLanguage,
} from '../../core/services/language.service';
import { BilingualField, BilingualArrayField } from '../../core/models';

@Pipe({
  name: 'localize',
  standalone: true,
  pure: false, // Impure so language toggle immediately re-evaluates in templates
})
export class LocalizePipe implements PipeTransform {
  private readonly languageService = inject(LanguageService);

  public transform(
    field: BilingualArrayField,
    fallbackLang?: SupportedLanguage,
  ): string[];
  public transform(
    field: BilingualField,
    fallbackLang?: SupportedLanguage,
  ): string;
  public transform(
    field: null | undefined,
    fallbackLang?: SupportedLanguage,
  ): '';
  public transform(
    field?: BilingualField | BilingualArrayField | null,
    fallbackLang?: SupportedLanguage,
  ): string | string[];
  public transform(
    field?: BilingualField | BilingualArrayField | null,
    fallbackLang: SupportedLanguage = 'en',
  ): string | string[] {
    if (!field) {
      return '';
    }

    const currentLang = this.languageService.currentLang();
    const value = field[currentLang];

    if (Array.isArray(value)) {
      if (value.length > 0) {
        return value;
      }
      return (field[fallbackLang] as string[]) || [];
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }

    const fallback = field[fallbackLang];
    return typeof fallback === 'string' ? fallback : '';
  }
}
