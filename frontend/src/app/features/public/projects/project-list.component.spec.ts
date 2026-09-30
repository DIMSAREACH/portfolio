import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ProjectListComponent } from './project-list.component';
import { PortfolioService } from '../../../core/services/portfolio.service';
import {
  LanguageService,
  SupportedLanguage,
} from '../../../core/services/language.service';
import { Project, Category, PaginatedResponse, ApiResponse } from '../../../core/models';

describe('ProjectListComponent', () => {
  let component: ProjectListComponent;
  let fixture: ComponentFixture<ProjectListComponent>;

  let portfolioServiceMock: {
    getProjects: ReturnType<typeof vi.fn>;
    getCategories: ReturnType<typeof vi.fn>;
  };

  let languageServiceMock: {
    currentLang: ReturnType<typeof signal<SupportedLanguage>>;
    isKhmer: ReturnType<typeof signal<boolean>>;
  };

  const mockProjects: Project[] = [
    {
      _id: 'proj1',
      title: { en: 'CamTraffic AI', kh: 'CamTraffic AI' },
      slug: 'camtraffic-ai',
      shortDescription: { en: 'Traffic AI description', kh: 'ពិពណ៌នាចរាចរណ៍' },
      fullDescription: { en: 'Full desc', kh: 'ពិពណ៌នាពេញលេញ' },
      category: {
        _id: 'cat1',
        name: { en: 'AI/ML', kh: 'បញ្ញាសិប្បនិម្មិត' },
        slug: 'ai-ml',
        type: 'project',
        order: 1,
      },
      technologies: ['Python', 'YOLO', 'OpenCV'],
      mainImage: 'https://example.com/img1.jpg',
      screenshots: [],
      featured: true,
      status: 'published',
      order: 1,
      viewCount: 120,
    },
    {
      _id: 'proj2',
      title: { en: 'Pharmacy POS', kh: 'ប្រព័ន្ធឱសថស្ថាន' },
      slug: 'pharmacy-pos',
      shortDescription: { en: 'POS description', kh: 'ពិពណ៌នា POS' },
      fullDescription: { en: 'Full desc 2', kh: 'ពិពណ៌នាពេញលេញ ២' },
      category: {
        _id: 'cat2',
        name: { en: 'Web Application', kh: 'កម្មវិធីគេហទំព័រ' },
        slug: 'web-app',
        type: 'project',
        order: 2,
      },
      technologies: ['Angular', 'TypeScript', 'Node.js', 'MongoDB'],
      mainImage: 'https://example.com/img2.jpg',
      screenshots: [],
      featured: false,
      status: 'published',
      order: 2,
      viewCount: 85,
    },
  ];

  const mockCategories: Category[] = [
    {
      _id: 'cat1',
      name: { en: 'AI/ML', kh: 'បញ្ញាសិប្បនិម្មិត' },
      slug: 'ai-ml',
      type: 'project',
      order: 1,
    },
    {
      _id: 'cat2',
      name: { en: 'Web Application', kh: 'កម្មវិធីគេហទំព័រ' },
      slug: 'web-app',
      type: 'project',
      order: 2,
    },
  ];

  const mockPaginatedProjects: PaginatedResponse<Project> = {
    success: true,
    message: 'Projects retrieved',
    data: {
      items: mockProjects,
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
      getProjects: vi.fn().mockReturnValue(of(mockPaginatedProjects)),
      getCategories: vi.fn().mockReturnValue(of(mockCategoriesResponse)),
    };

    languageServiceMock = {
      currentLang: signal<SupportedLanguage>('en'),
      isKhmer: signal<boolean>(false),
    };

    await TestBed.configureTestingModule({
      imports: [ProjectListComponent],
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

    fixture = TestBed.createComponent(ProjectListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects and categories on init', () => {
    fixture.detectChanges();

    expect(portfolioServiceMock.getProjects).toHaveBeenCalled();
    expect(portfolioServiceMock.getCategories).toHaveBeenCalledWith('project');
    expect(component.projects().length).toBe(2);
    expect(component.categories().length).toBe(2);
    expect(component.isLoading()).toBe(false);
    expect(component.totalItems()).toBe(2);
  });

  it('should filter by category and reset to page 1', () => {
    fixture.detectChanges();

    component.onCategorySelect('ai-ml');
    expect(component.selectedCategory()).toBe('ai-ml');
    expect(component.currentPage()).toBe(1);
    expect(portfolioServiceMock.getProjects).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'ai-ml', page: 1 }),
    );
  });

  it('should filter by technology and update state', () => {
    fixture.detectChanges();

    component.onTechSelect('Python');
    expect(component.selectedTech()).toBe('Python');
    expect(portfolioServiceMock.getProjects).toHaveBeenCalledWith(
      expect.objectContaining({ tech: 'Python' }),
    );
  });

  it('should filter by search query', () => {
    fixture.detectChanges();

    const mockEvent = { target: { value: 'Traffic' } } as unknown as Event;
    component.onSearchInput(mockEvent);

    expect(component.searchQuery()).toBe('Traffic');
    expect(portfolioServiceMock.getProjects).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'Traffic' }),
    );
  });

  it('should handle pagination page change', () => {
    fixture.detectChanges();

    portfolioServiceMock.getProjects.mockReturnValue(
      of({
        success: true,
        message: 'Projects page 2',
        data: {
          items: mockProjects,
          pagination: { total: 2, totalPages: 2, page: 2, limit: 6, hasNextPage: false, hasPrevPage: true },
        },
      }),
    );

    component.onPageChange(2);
    expect(component.currentPage()).toBe(2);
    expect(portfolioServiceMock.getProjects).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2 }),
    );
  });

  it('should reset all filters on resetFilters()', () => {
    fixture.detectChanges();

    component.selectedCategory.set('ai-ml');
    component.selectedTech.set('Python');
    component.searchQuery.set('test');

    component.resetFilters();

    expect(component.selectedCategory()).toBe('all');
    expect(component.selectedTech()).toBe('all');
    expect(component.searchQuery()).toBe('');
    expect(component.currentPage()).toBe(1);
  });

  it('should handle errors gracefully and allow retry', () => {
    portfolioServiceMock.getProjects.mockReturnValue(throwError(() => new Error('Server error')));

    component.loadProjects();
    fixture.detectChanges();

    expect(component.error()).toBeTruthy();
    expect(component.isLoading()).toBe(false);

    // Retry
    portfolioServiceMock.getProjects.mockReturnValue(of(mockPaginatedProjects));
    component.loadProjects();
    fixture.detectChanges();

    expect(component.error()).toBeNull();
    expect(component.projects().length).toBe(2);
  });

  it('should render empty state when no projects match', () => {
    portfolioServiceMock.getProjects.mockReturnValue(
      of({
        success: true,
        message: 'No projects',
        data: { items: [], pagination: { total: 0, totalPages: 1, page: 1, limit: 6, hasNextPage: false, hasPrevPage: false } },
      }),
    );

    component.loadProjects();
    fixture.detectChanges();

    expect(component.projects().length).toBe(0);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-empty-state')).toBeTruthy();
  });
});
