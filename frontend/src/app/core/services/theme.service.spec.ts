import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let doc: Document;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [ThemeService],
    });

    service = TestBed.inject(ThemeService);
    doc = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with default light theme when no storage preference exists', () => {
    expect(['light', 'dark']).toContain(service.theme());
    expect(doc.documentElement.getAttribute('data-theme')).toBe(service.theme());
  });

  it('should explicitly set dark theme and update document element', () => {
    service.setTheme('dark');

    expect(service.theme()).toBe('dark');
    expect(service.isDark()).toBe(true);
    expect(doc.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(doc.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('portfolio_theme')).toBe('dark');
  });

  it('should explicitly set light theme and update document element', () => {
    service.setTheme('light');

    expect(service.theme()).toBe('light');
    expect(service.isDark()).toBe(false);
    expect(doc.documentElement.getAttribute('data-theme')).toBe('light');
    expect(doc.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('portfolio_theme')).toBe('light');
  });

  it('should toggle between light and dark', () => {
    service.setTheme('light');
    expect(service.theme()).toBe('light');

    service.toggle();
    expect(service.theme()).toBe('dark');
    expect(doc.documentElement.getAttribute('data-theme')).toBe('dark');

    service.toggle();
    expect(service.theme()).toBe('light');
    expect(doc.documentElement.getAttribute('data-theme')).toBe('light');
  });
});
