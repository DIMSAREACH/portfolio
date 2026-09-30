import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { TranslatePipe } from './index';

@Component({
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <span id="home-label">{{ 'nav.home' | translate }}</span>
    <span id="button-label">{{ 'contact.send_button' | translate }}</span>
    <span id="param-label">{{ 'common.showing' | translate }}</span>
  `,
})
class TestHostComponent {}

describe('TranslatePipe', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let languageService: LanguageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        LanguageService,
        provideTranslateService({
          fallbackLang: 'en',
          lang: 'en',
        }),
      ],
    }).compileComponents();

    languageService = TestBed.inject(LanguageService);
    languageService.setLanguage('en');
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render English translations by default', () => {
    const homeEl = fixture.nativeElement.querySelector('#home-label');
    const buttonEl = fixture.nativeElement.querySelector('#button-label');

    expect(homeEl.textContent.trim()).toBe('Home');
    expect(buttonEl.textContent.trim()).toBe('Send Message');
  });

  it('should update translations when language is switched to Khmer', () => {
    languageService.setLanguage('kh');
    fixture.detectChanges();

    const homeEl = fixture.nativeElement.querySelector('#home-label');
    const buttonEl = fixture.nativeElement.querySelector('#button-label');

    expect(homeEl.textContent.trim()).toBe('ទំព័រដើម');
    expect(buttonEl.textContent.trim()).toBe('ផ្ញើសារឥឡូវនេះ');
  });
});
