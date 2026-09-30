import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { BlogListComponent } from './blog-list.component';
import { PortfolioService } from '../../../core/services/portfolio.service';
import {
  LanguageService,
  SupportedLanguage,
} from '../../../core/services/language.service';
import { BlogPost, Category, PaginatedResponse, ApiResponse } from '../../../core/models';

describe('BlogListComponent', () => {
  let component: BlogListComponent;
  let fixture: ComponentFixture<BlogListComponent>;

  let portfolioServiceMock: {
    getBlogPosts: ReturnType<typeof vi.fn>;
    getCategories: ReturnType<typeof vi.fn>;
  };

  let languageServiceMock: {
    currentLang: ReturnType<typeof signal<SupportedLanguage>>;
    isKhmer: ReturnType<typeof signal<boolean>>;
  };

  const mockPosts: BlogPost[] = [
    {
      _id: 'post1',
      title: { en: 'Angular Signals Deep Dive', kh: 'ការសិក្សាស៊ីជម្រៅលើ Angular Signals' },
      slug: 'angular-signals-deep-dive',
      excerpt: { en: 'Master signals in Angular', kh: 'ស្វែងយល់ Signals ក្នុង Angular' },
      content: { en: 'Content 1', kh: 'មាតិកា ១' },
      category: {
        _id: 'cat1',
        name: { en: 'Frontend', kh: 'ផ្នែកខាងមុខ' },
        slug: 'frontend',
        type: 'blog',
        order: 1,
      },
      tags: ['Angular', 'TypeScript', 'Signals'],
      status: 'published',
      featured: true,
      publishedAt: new Date('2026-09-20'),
      readingTime: 5,
      viewCount: 150,
      author: 'admin',
      createdAt: new Date('2026-09-20'),
    },
    {
      _id: 'post2',
      title: { en: 'Node.js Microservices Patterns', kh: 'ទម្រង់ Microservices ជាមួយ Node.js' },
      slug: 'nodejs-microservices-patterns',
      excerpt: { en: 'Build scalable services', kh: 'បង្កើតប្រព័ន្ធដែលអាចពង្រីកបាន' },
      content: { en: 'Content 2', kh: 'មាតិកា ២' },
      category: {
        _id: 'cat2',
        name: { en: 'Backend', kh: 'ផ្នែកខាងក្រោយ' },
        slug: 'backend',
        type: 'blog',
        order: 2,
      },
      tags: ['Node.js', 'Docker', 'Architecture'],
      status: 'published',
      featured: false,
      publishedAt: new Date('2026-09-25'),
      readingTime: 8,
      viewCount: 95,
      author: 'admin',
      createdAt: new Date('2026-09-25'),
    },
  ];

  const mockCategories: Category[] = [
    {
      _id: 'cat1',
      name: { en: 'Frontend', kh: 'ផ្នែកខាងមុខ' },
      slug: 'frontend',
      type: 'blog',
      order: 1,
    },
    {
      _id: 'cat2',
      name: { en: 'Backend', kh: 'ផ្នែកខាងក្រោយ' },
      slug: 'backend',
      type: 'blog',
      order: 2,
    },
  ];

  const mockPaginatedPosts: PaginatedResponse<BlogPost> = {
    success: true,
    message: 'Blog posts retrieved',
    data: {
      items: mockPosts,
      pagination: {
        total: 2,
        totalPages: 1,
        page: 1,
        limit: 6,
        hasNextPage: false,
        hasPrevPage: false,
      },
    },
  };

  const mockCategoriesResponse: ApiResponse<Category[]> = {
    success: true,
    message: 'Categories retrieved',
    data: mockCategories,
  };

  beforeEach(async () => {
    portfolioServiceMock = {
      getBlogPosts: vi.fn().mockReturnValue(of(mockPaginatedPosts)),
      getCategories: vi.fn().mockReturnValue(of(mockCategoriesResponse)),
    };

    languageServiceMock = {
      currentLang: signal<SupportedLanguage>('en'),
      isKhmer: signal<boolean>(false),
    };

    await TestBed.configureTestingModule({
      imports: [BlogListComponent],
      providers: [
        provideRouter([]),
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
            routeConfig: {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load blog posts and categories on init', () => {
    fixture.detectChanges();

    expect(portfolioServiceMock.getBlogPosts).toHaveBeenCalled();
    expect(portfolioServiceMock.getCategories).toHaveBeenCalledWith('blog');
    expect(component.posts().length).toBe(2);
    expect(component.categories().length).toBe(2);
    expect(component.isLoading()).toBe(false);
    expect(component.totalItems()).toBe(2);
    expect(component.tags().length).toBeGreaterThan(0);
  });

  it('should extract featured post correctly', () => {
    fixture.detectChanges();

    expect(component.featuredPost()).not.toBeNull();
    expect(component.featuredPost()?._id).toBe('post1');
  });

  it('should filter by category and reset to page 1', () => {
    fixture.detectChanges();

    component.onCategorySelect('frontend');
    expect(component.selectedCategory()).toBe('frontend');
    expect(component.currentPage()).toBe(1);
    expect(portfolioServiceMock.getBlogPosts).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'frontend', page: 1 }),
    );
  });

  it('should filter by tag and update state', () => {
    fixture.detectChanges();

    component.onTagSelect('Angular');
    expect(component.selectedTag()).toBe('Angular');
    expect(portfolioServiceMock.getBlogPosts).toHaveBeenCalledWith(
      expect.objectContaining({ tag: 'Angular' }),
    );
  });

  it('should filter by search query and clear search', () => {
    fixture.detectChanges();

    const mockEvent = { target: { value: 'Signals' } } as unknown as Event;
    component.onSearchInput(mockEvent);

    expect(component.searchQuery()).toBe('Signals');
    expect(portfolioServiceMock.getBlogPosts).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'Signals' }),
    );

    component.clearSearch();
    expect(component.searchQuery()).toBe('');
    expect(portfolioServiceMock.getBlogPosts).toHaveBeenCalledWith(
      expect.not.objectContaining({ search: 'Signals' }),
    );
  });

  it('should handle pagination page change', () => {
    fixture.detectChanges();

    portfolioServiceMock.getBlogPosts.mockReturnValue(
      of({
        success: true,
        message: 'Blog posts page 2',
        data: {
          items: mockPosts,
          pagination: { total: 2, totalPages: 2, page: 2, limit: 6, hasNextPage: false, hasPrevPage: true },
        },
      }),
    );

    component.onPageChange(2);
    expect(component.currentPage()).toBe(2);
    expect(portfolioServiceMock.getBlogPosts).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2 }),
    );
  });

  it('should reset all filters on resetFilters()', () => {
    fixture.detectChanges();

    component.selectedCategory.set('frontend');
    component.selectedTag.set('Angular');
    component.searchQuery.set('Signals');

    component.resetFilters();

    expect(component.selectedCategory()).toBe('all');
    expect(component.selectedTag()).toBe('all');
    expect(component.searchQuery()).toBe('');
    expect(component.currentPage()).toBe(1);
  });

  it('should handle errors gracefully and allow retry', () => {
    portfolioServiceMock.getBlogPosts.mockReturnValue(throwError(() => new Error('Server error')));

    component.loadPosts();
    fixture.detectChanges();

    expect(component.error()).toBeTruthy();
    expect(component.isLoading()).toBe(false);

    // Retry
    portfolioServiceMock.getBlogPosts.mockReturnValue(of(mockPaginatedPosts));
    component.loadPosts();
    fixture.detectChanges();

    expect(component.error()).toBeNull();
    expect(component.posts().length).toBe(2);
  });

  it('should render empty state when no posts match', () => {
    portfolioServiceMock.getBlogPosts.mockReturnValue(
      of({
        success: true,
        message: 'No posts',
        data: { items: [], pagination: { total: 0, totalPages: 1, page: 1, limit: 6, hasNextPage: false, hasPrevPage: false } },
      }),
    );

    component.loadPosts();
    fixture.detectChanges();

    expect(component.posts().length).toBe(0);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-empty-state')).toBeTruthy();
  });
});
