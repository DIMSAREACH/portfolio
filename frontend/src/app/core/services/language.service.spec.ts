import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { LanguageService } from './language.service';
import { BilingualField, BilingualArrayField } from '../models';

describe('LanguageService', () => {
  let service: LanguageService;
  let doc: Document;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [LanguageService],
    });

    service = TestBed.inject(LanguageService);
    doc = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with default en language', () => {
    expect(['en', 'kh']).toContain(service.currentLang());
    expect(doc.documentElement.lang).toBe(service.currentLang());
  });

  it('should set language to Khmer and update document and storage', () => {
    service.setLanguage('kh');

    expect(service.currentLang()).toBe('kh');
    expect(service.isKhmer()).toBe(true);
    expect(doc.documentElement.lang).toBe('kh');
    expect(localStorage.getItem('portfolio_lang')).toBe('kh');
  });

  it('should toggle between en and kh', () => {
    service.setLanguage('en');
    expect(service.currentLang()).toBe('en');

    service.toggleLanguage();
    expect(service.currentLang()).toBe('kh');

    service.toggleLanguage();
    expect(service.currentLang()).toBe('en');
  });

  it('should retrieve localized text properly based on active language', () => {
    const field: BilingualField = {
      en: 'Developer',
      kh: 'អ្នកអភិវឌ្ឍន៍',
    };

    service.setLanguage('en');
    expect(service.getLocalizedText(field)).toBe('Developer');

    service.setLanguage('kh');
    expect(service.getLocalizedText(field)).toBe('អ្នកអភិវឌ្ឍន៍');
  });

  it('should fallback to English if Khmer field is empty in getLocalizedText', () => {
    const field: BilingualField = {
      en: 'Only English',
      kh: '',
    };

    service.setLanguage('kh');
    expect(service.getLocalizedText(field)).toBe('Only English');
  });

  it('should retrieve localized array properly', () => {
    const field: BilingualArrayField = {
      en: ['Skill 1', 'Skill 2'],
      kh: ['ជំនាញ ១', 'ជំនាញ ២'],
    };

    service.setLanguage('en');
    expect(service.getLocalizedArray(field)).toEqual(['Skill 1', 'Skill 2']);

    service.setLanguage('kh');
    expect(service.getLocalizedArray(field)).toEqual(['ជំនាញ ១', 'ជំនាញ ២']);
  });
});
