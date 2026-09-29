import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { FooterComponent } from './footer.component';
import { LanguageService } from '../../../core/services/language.service';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  let languageServiceMock: {
    currentLanguage: ReturnType<typeof signal<string>>;
    isKhmer: ReturnType<typeof signal<boolean>>;
    setLanguage: ReturnType<typeof vi.fn>;
    toggleLanguage: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    languageServiceMock = {
      currentLanguage: signal('en'),
      isKhmer: signal(false),
      setLanguage: vi.fn(),
      toggleLanguage: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [
        provideRouter([]),
        { provide: LanguageService, useValue: languageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render copyright year', () => {
    const footerText = fixture.nativeElement.textContent;
    expect(footerText).toContain(new Date().getFullYear().toString());
    expect(footerText).toContain('Dim Sareach. All rights reserved.');
  });

  it('should render social links', () => {
    const socialLinks = fixture.nativeElement.querySelectorAll('a[target="_blank"]');
    expect(socialLinks.length).toBe(component.socialLinks.length);
  });

  it('should trigger window.scrollTo when back to top is clicked', () => {
    const scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy;

    const backToTopBtn = fixture.nativeElement.querySelector('#back-to-top-btn');
    backToTopBtn.click();

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
