import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { BlogCardComponent } from './blog-card.component';
import {
  LanguageService,
  SupportedLanguage,
} from '../../../core/services/language.service';
import { BlogPost } from '../../../core/models';

describe('BlogCardComponent', () => {
  let component: BlogCardComponent;
  let fixture: ComponentFixture<BlogCardComponent>;

  let languageServiceMock: {
    currentLang: ReturnType<typeof signal<SupportedLanguage>>;
    isKhmer: ReturnType<typeof signal<boolean>>;
  };

  const mockPost: BlogPost = {
    _id: 'post1',
    title: { en: 'Getting Started with Angular Signals', kh: 'ការចាប់ផ្តើមជាមួយ Angular Signals' },
    slug: 'getting-started-with-angular-signals',
    excerpt: {
      en: 'Learn how to manage reactive state cleanly in Angular 19+.',
      kh: 'ស្វែងយល់ពីការគ្រប់គ្រង Reactive State ក្នុង Angular 19+។',
    },
    content: { en: 'Full content', kh: 'មាតិកាពេញលេញ' },
    category: {
      _id: 'cat1',
      name: { en: 'Frontend', kh: 'ផ្នែកខាងមុខ' },
      slug: 'frontend',
      type: 'blog',
      order: 1,
    },
    tags: ['Angular', 'TypeScript', 'Signals', 'RxJS'],
    status: 'published',
    featured: true,
    publishedAt: new Date('2026-09-15'),
    readingTime: 6,
    viewCount: 320,
    author: 'admin',
    createdAt: new Date('2026-09-15'),
  };

  beforeEach(async () => {
    languageServiceMock = {
      currentLang: signal<SupportedLanguage>('en'),
      isKhmer: signal<boolean>(false),
    };

    await TestBed.configureTestingModule({
      imports: [BlogCardComponent],
      providers: [
        provideRouter([]),
        { provide: LanguageService, useValue: languageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('post', mockPost);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display title, excerpt, and reading time', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Getting Started with Angular Signals');
    expect(compiled.textContent).toContain('Learn how to manage reactive state cleanly in Angular 19+.');
    expect(compiled.textContent).toContain('6 min read');
  });

  it('should resolve category name in English and Khmer', () => {
    expect(component.categoryName()).toBe('Frontend');

    languageServiceMock.currentLang.set('kh');
    fixture.detectChanges();
    expect(component.categoryName()).toBe('ផ្នែកខាងមុខ');
  });

  it('should display featured badge when post is featured', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Featured');

    fixture.componentRef.setInput('showFeaturedBadge', false);
    fixture.detectChanges();
    expect(compiled.textContent).not.toContain('Featured');
  });

  it('should display up to 3 tags and count remaining', () => {
    expect(component.displayedTags()).toEqual(['Angular', 'TypeScript', 'Signals']);
    expect(component.remainingTagsCount()).toBe(1);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('+1');
  });

  it('should format publication date correctly', () => {
    const formatted = component.formatDate(new Date('2026-09-15'));
    expect(formatted).toBeTruthy();
  });
});
