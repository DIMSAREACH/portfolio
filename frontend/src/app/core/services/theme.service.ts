import { Injectable, signal, computed, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'portfolio_theme';

  /**
   * Reactive signal holding current theme ('light' | 'dark')
   */
  public readonly theme = signal<ThemeMode>('light');

  /**
   * Computed boolean helper
   */
  public readonly isDark = computed<boolean>(() => this.theme() === 'dark');

  constructor() {
    this.initializeTheme();
  }

  /**
   * Toggle between light and dark modes
   */
  public toggle(): void {
    const nextTheme: ThemeMode = this.theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  /**
   * Explicitly set theme mode
   */
  public setTheme(newTheme: ThemeMode): void {
    this.theme.set(newTheme);
    this.applyTheme(newTheme);

    try {
      localStorage.setItem(this.storageKey, newTheme);
    } catch {
      // Storage access disabled or in private mode
    }
  }

  /**
   * Initialize theme from localStorage or OS preference
   */
  private initializeTheme(): void {
    let initialTheme: ThemeMode = 'light';

    try {
      const savedTheme = localStorage.getItem(this.storageKey) as ThemeMode | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        initialTheme = savedTheme;
      } else if (
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        initialTheme = 'dark';
      }
    } catch {
      initialTheme = 'light';
    }

    this.theme.set(initialTheme);
    this.applyTheme(initialTheme);
    this.listenToSystemThemeChanges();
  }

  /**
   * Apply theme attribute and class to the document element
   */
  private applyTheme(theme: ThemeMode): void {
    if (!this.document || !this.document.documentElement) {
      return;
    }

    const htmlElement = this.document.documentElement;
    htmlElement.setAttribute('data-theme', theme);

    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }

  /**
   * Reactively update if system changes and user hasn't explicitly set preference
   */
  private listenToSystemThemeChanges(): void {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event: MediaQueryListEvent) => {
      try {
        const hasExplicitChoice = localStorage.getItem(this.storageKey);
        if (!hasExplicitChoice) {
          const sysTheme: ThemeMode = event.matches ? 'dark' : 'light';
          this.theme.set(sysTheme);
          this.applyTheme(sysTheme);
        }
      } catch {
        /* ignore */
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else {
      mediaQuery.addListener(listener);
    }
  }
}
