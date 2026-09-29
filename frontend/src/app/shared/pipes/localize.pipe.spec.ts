import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { LocalizePipe } from './localize.pipe';
import {
  LanguageService,
  SupportedLanguage,
} from '../../core/services/language.service';
import { BilingualField, BilingualArrayField } from '../../core/models';

describe('LocalizePipe', () => {
  let pipe: LocalizePipe;
  let languageServiceMock: {
    currentLang: ReturnType<typeof signal<SupportedLanguage>>;
  };

  beforeEach(() => {
    languageServiceMock = {
      currentLang: signal<SupportedLanguage>('en'),
    };

    TestBed.configureTestingModule({
      providers: [
        LocalizePipe,
        { provide: LanguageService, useValue: languageServiceMock },
      ],
    });

    pipe = TestBed.inject(LocalizePipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return English text when current language is en', () => {
    const field: BilingualField = {
      en: 'Software Engineer',
      kh: 'វិស្វករកម្មវិធី',
    };

    expect(pipe.transform(field)).toBe('Software Engineer');
  });

  it('should return Khmer text when current language is kh', () => {
    languageServiceMock.currentLang.set('kh');
    const field: BilingualField = {
      en: 'Software Engineer',
      kh: 'វិស្វករកម្មវិធី',
    };

    expect(pipe.transform(field)).toBe('វិស្វករកម្មវិធី');
  });

  it('should fallback to English if Khmer text is empty', () => {
    languageServiceMock.currentLang.set('kh');
    const field: BilingualField = {
      en: 'Software Engineer',
      kh: '',
    };

    expect(pipe.transform(field)).toBe('Software Engineer');
  });

  it('should return empty string if field is null or undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should correctly localize string arrays for BilingualArrayField', () => {
    const arrayField: BilingualArrayField = {
      en: ['TypeScript', 'Angular'],
      kh: ['ប្រភេទស្គ្រីប', 'អង់ហ្គូឡា'],
    };

    expect(pipe.transform(arrayField)).toEqual(['TypeScript', 'Angular']);

    languageServiceMock.currentLang.set('kh');
    expect(pipe.transform(arrayField)).toEqual(['ប្រភេទស្គ្រីប', 'អង់ហ្គូឡា']);
  });
});
