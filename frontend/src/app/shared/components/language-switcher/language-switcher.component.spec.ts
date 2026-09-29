import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { LanguageSwitcherComponent } from './language-switcher.component';
import {
  LanguageService,
  SupportedLanguage,
} from '../../../core/services/language.service';

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let languageServiceMock: {
    currentLang: ReturnType<typeof signal<SupportedLanguage>>;
    setLanguage: ReturnType<typeof vi.fn>;
    toggleLanguage: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    languageServiceMock = {
      currentLang: signal<SupportedLanguage>('en'),
      setLanguage: vi.fn(),
      toggleLanguage: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LanguageSwitcherComponent],
      providers: [{ provide: LanguageService, useValue: languageServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setLanguage when switching to Khmer', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const khButton = buttons[1] as HTMLButtonElement;
    khButton.click();

    expect(languageServiceMock.setLanguage).toHaveBeenCalledWith('kh');
  });

  it('should not call setLanguage if target language is already active', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const enButton = buttons[0] as HTMLButtonElement;
    enButton.click();

    expect(languageServiceMock.setLanguage).not.toHaveBeenCalled();
  });
});
