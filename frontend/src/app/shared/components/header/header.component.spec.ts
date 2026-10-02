import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { HeaderComponent } from './header.component';
import {
  LanguageService,
  SupportedLanguage,
} from '../../../core/services/language.service';
import { ThemeService } from '../../../core/services/theme.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  let languageServiceMock: {
    currentLang: ReturnType<typeof signal<SupportedLanguage>>;
    isKhmer: ReturnType<typeof signal<boolean>>;
    setLanguage: ReturnType<typeof vi.fn>;
    toggleLanguage: ReturnType<typeof vi.fn>;
  };

  let themeServiceMock: {
    isDark: ReturnType<typeof signal<boolean>>;
    toggle: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    languageServiceMock = {
      currentLang: signal<SupportedLanguage>('en'),
      isKhmer: signal(false),
      setLanguage: vi.fn(),
      toggleLanguage: vi.fn(),
    };

    themeServiceMock = {
      isDark: signal(false),
      toggle: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: ThemeService, useValue: themeServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display desktop nav items in English by default', () => {
    const navLinks = fixture.nativeElement.querySelectorAll('nav a');
    expect(navLinks.length).toBe(component.navItems.length);
    expect(navLinks[0].textContent).toContain('Home');
    expect(navLinks[1].textContent).toContain('About');
  });

  it('should display Khmer labels when isKhmer is true', () => {
    languageServiceMock.isKhmer.set(true);
    fixture.detectChanges();

    const navLinks = fixture.nativeElement.querySelectorAll('nav a');
    expect(navLinks[0].textContent).toContain('ទំព័រដើម');
  });

  it('should toggle mobile menu when hamburger button is clicked', () => {
    expect(component.isMobileMenuOpen).toBe(false);

    const hamburgerBtn = fixture.nativeElement.querySelector('#mobile-menu-btn');
    hamburgerBtn.click();
    fixture.detectChanges();

    expect(component.isMobileMenuOpen).toBe(true);

    const mobileNav = fixture.nativeElement.querySelector('#mobile-navigation');
    expect(mobileNav).toBeTruthy();

    hamburgerBtn.click();
    fixture.detectChanges();

    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('should close mobile menu when a mobile nav link is clicked', () => {
    const hamburgerBtn = fixture.nativeElement.querySelector('#mobile-menu-btn');
    hamburgerBtn.click();
    fixture.detectChanges();

    const mobileNav = fixture.nativeElement.querySelector('#mobile-navigation');
    expect(mobileNav).toBeTruthy();

    const firstLink = mobileNav.querySelector('a') as HTMLAnchorElement;
    firstLink.click();
    fixture.detectChanges();

    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('should toggle isScrolled based on scroll position', () => {
    expect(component.isScrolled()).toBe(false);

    // Simulate scrolling past 10px
    Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
    component.onWindowScroll();
    expect(component.isScrolled()).toBe(true);

    // Simulate scrolling back to top
    window.scrollY = 0;
    component.onWindowScroll();
    expect(component.isScrolled()).toBe(false);
  });
});
