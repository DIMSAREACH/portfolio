import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { BlogDetailComponent } from './blog-detail.component';
import { PortfolioService } from '../../../core/services/portfolio.service';
import {
  LanguageService,
  SupportedLanguage,
} from '../../../core/services/language.service';
import { BlogPost, Category, ApiResponse, PaginatedResponse } from '../../../core/models';

describe('BlogDetailComponent', () => {
  let component: BlogDetailComponent;
  let fixture: ComponentFixture<BlogDetailComponent>;

  let portfolioServiceMock: {
    getBlogPostBySlug: ReturnType<typeof vi.fn>;
    getBlogPosts: ReturnType<typeof vi.fn>;
  };

  let languageServiceMock: {
    currentLang: ReturnType<typeof signal<SupportedLanguage>>;
    isKhmer: ReturnType<typeof signal<boolean>>;
  };

  const mockCategory: Category = {
    _id: 'cat1',
    name: { en: 'Architecture', kh: 'ស្ថាបត្យកម្ម' },
    slug: 'architecture',
    type: 'blog',
    order: 1,
  };

  const mockPost: BlogPost = {
    _id: 'post1',
    title: { en: 'Micro Frontends with Angular', kh: 'Micro Frontends ជាមួយ Angular' },
    slug: 'micro-frontends-with-angular',
    excerpt: { en: 'A guide to module federation', kh: 'ការណែនាំអំពី Module Federation' },
    content: {
      en: '# Introduction\n\nHere is a code snippet:\n\n```typescript\nconst x: number = 42;\nconsole.log(x);\n```\n\nEnjoy reading!',
      kh: '# សេចក្តីផ្តើម\n\nនេះជាកូដគំរូ:\n\n```typescript\nconst x: number = 42;\nconsole.log(x);\n```\n\nសូមរីករាយអាន!',
    },
    category: mockCategory,
    tags: ['Angular', 'Architecture', 'TypeScript'],
    status: 'published',
    featured: true,
    publishedAt: new Date('2026-09-18'),
    readingTime: 7,
    viewCount: 450,
    author: 'admin',
    createdAt: new Date('2026-09-18'),
  };

  const mockRelatedPosts: BlogPost[] = [
    {
      _id: 'post2',
      title: { en: 'State Management Patterns', kh: 'ទម្រង់គ្រប់គ្រង State' },
      slug: 'state-management-patterns',
      excerpt: { en: 'Signals vs RxJS', kh: 'Signals និង RxJS' },
      content: { en: 'Content', kh: 'មាតិកា' },
      category: mockCategory,
      tags: ['Angular', 'State'],
      status: 'published',
      featured: false,
      publishedAt: new Date('2026-09-19'),
      readingTime: 4,
      viewCount: 210,
      author: 'admin',
      createdAt: new Date('2026-09-19'),
    },
    mockPost, // should be filtered out from related list
  ];

  const mockPostResponse: ApiResponse<BlogPost> = {
    success: true,
    message: 'Post found',
    data: mockPost,
  };

  const mockRelatedResponse: PaginatedResponse<BlogPost> = {
    success: true,
    message: 'Related posts found',
    data: {
      items: mockRelatedPosts,
      pagination: { total: 2, totalPages: 1, page: 1, limit: 4, hasNextPage: false, hasPrevPage: false },
    },
  };

  beforeEach(async () => {
    portfolioServiceMock = {
      getBlogPostBySlug: vi.fn().mockReturnValue(of(mockPostResponse)),
      getBlogPosts: vi.fn().mockReturnValue(of(mockRelatedResponse)),
    };

    languageServiceMock = {
      currentLang: signal<SupportedLanguage>('en'),
      isKhmer: signal<boolean>(false),
    };

    await TestBed.configureTestingModule({
      imports: [BlogDetailComponent],
      providers: [
        provideRouter([]),
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ slug: 'micro-frontends-with-angular' })),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load post details on init via slug param', () => {
    fixture.detectChanges();

    expect(portfolioServiceMock.getBlogPostBySlug).toHaveBeenCalledWith('micro-frontends-with-angular');
    expect(component.post()).toEqual(mockPost);
    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBeNull();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Micro Frontends with Angular');
    expect(compiled.textContent).toContain('7 min read');
    expect(compiled.textContent).toContain('Dim Sareach');
    expect(compiled.textContent).toContain('450 views');
  });

  it('should render markdown content with syntax highlighted code blocks', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const content = compiled.querySelector('.blog-content');
    expect(content?.textContent).toContain('Introduction');
    expect(content?.innerHTML).toContain('code-wrapper');
    expect(content?.innerHTML).toContain('language-typescript');
  });

  it('should load and filter related posts', () => {
    fixture.detectChanges();

    expect(portfolioServiceMock.getBlogPosts).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'architecture' }),
    );
    // Should filter out the current post (post1) and leave only post2
    expect(component.relatedPosts().length).toBe(1);
    expect(component.relatedPosts()[0]._id).toBe('post2');
  });

  it('should handle post not found error', () => {
    portfolioServiceMock.getBlogPostBySlug.mockReturnValue(throwError(() => new Error('Not found')));

    component.loadPostDetails('unknown-post');
    fixture.detectChanges();

    expect(component.error()).toBeTruthy();
    expect(component.isLoading()).toBe(false);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-empty-state')).toBeTruthy();
  });

  it('should handle copying article link to clipboard', () => {
    fixture.detectChanges();

    const clipboardMock = {
      writeText: vi.fn().mockResolvedValue(undefined),
    };
    Object.assign(navigator, { clipboard: clipboardMock });

    component.copyLink();
    expect(clipboardMock.writeText).toHaveBeenCalled();
    expect(component.linkCopied()).toBe(true);
  });

  it('should scroll to top smoothly when triggered', () => {
    const scrollToSpy = vi.fn();
    window.scrollTo = scrollToSpy;

    component.scrollToTop();
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('should localize category name and content correctly when language switches', () => {
    fixture.detectChanges();
    expect(component.categoryName()).toBe('Architecture');

    languageServiceMock.currentLang.set('kh');
    fixture.detectChanges();
    expect(component.categoryName()).toBe('ស្ថាបត្យកម្ម');
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.blog-content')?.textContent).toContain('សេចក្តីផ្តើម');
  });

  it('should compute reading time correctly', () => {
    fixture.detectChanges();
    expect(component.readingTime()).toBe(7);
  });

  it('should handle code block copy button click', () => {
    fixture.detectChanges();
    const clipboardMock = {
      writeText: vi.fn().mockResolvedValue(undefined),
    };
    Object.assign(navigator, { clipboard: clipboardMock });

    const btn = (fixture.nativeElement as HTMLElement).querySelector('.copy-code-btn') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    btn.click();
    expect(clipboardMock.writeText).toHaveBeenCalledWith(expect.stringContaining('const x: number = 42;'));
  });

  it('should fallback to recent posts when category has fewer than 2 related posts', () => {
    const mockPost3: BlogPost = {
      ...mockPost,
      _id: 'post3',
      slug: 'recent-post-3',
      title: { en: 'Recent Post 3', kh: 'អត្ថបទថ្មី ៣' },
    };

    portfolioServiceMock.getBlogPosts
      .mockReturnValueOnce(of({
        success: true,
        data: { items: [mockPost], pagination: { total: 1 } },
      }))
      .mockReturnValueOnce(of({
        success: true,
        data: { items: [mockPost3], pagination: { total: 1 } },
      }));

    component.loadRelatedPosts(mockPost);
    expect(component.relatedPosts().length).toBe(1);
    expect(component.relatedPosts()[0]._id).toBe('post3');
  });
});
