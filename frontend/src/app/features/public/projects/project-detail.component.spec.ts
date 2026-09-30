import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ProjectDetailComponent } from './project-detail.component';
import { PortfolioService } from '../../../core/services/portfolio.service';
import {
  LanguageService,
  SupportedLanguage,
} from '../../../core/services/language.service';
import { Project, ApiResponse, PaginatedResponse } from '../../../core/models';

describe('ProjectDetailComponent', () => {
  let component: ProjectDetailComponent;
  let fixture: ComponentFixture<ProjectDetailComponent>;

  let portfolioServiceMock: {
    getProjectBySlug: ReturnType<typeof vi.fn>;
    getProjects: ReturnType<typeof vi.fn>;
  };

  let languageServiceMock: {
    currentLang: ReturnType<typeof signal<SupportedLanguage>>;
    isKhmer: ReturnType<typeof signal<boolean>>;
  };

  const mockProject: Project = {
    _id: 'proj1',
    title: { en: 'CamTraffic AI', kh: 'CamTraffic AI' },
    slug: 'camtraffic-ai',
    shortDescription: {
      en: 'AI-based traffic sign detection system.',
      kh: 'ប្រព័ន្ធវៃឆ្លាតស្វែងរកស្លាកសញ្ញាចរាចរណ៍។',
    },
    fullDescription: {
      en: '## Architecture Overview\nBuilt with **YOLO** and **Angular**.',
      kh: '## ស្ថាបត្យកម្មប្រព័ន្ធ\nបង្កើតឡើងដោយ **YOLO** និង **Angular**.',
    },
    problem: {
      en: 'High rates of traffic infractions.',
      kh: 'អត្រានៃការល្មើសច្បាប់ចរាចរណ៍ខ្ពស់។',
    },
    solution: {
      en: 'Automated camera analytics using computer vision.',
      kh: 'ការវិភាគវីដេអូស្វ័យប្រវត្តិដោយប្រើប្រព័ន្ធ Computer Vision។',
    },
    features: {
      en: ['Real-time object detection', 'Plate recognition', 'Violations logging'],
      kh: ['ការចាប់សញ្ញារូបភាពផ្ទាល់', 'ការស្គាល់ស្លាកលេខ', 'ការកត់ត្រាការល្មើស'],
    },
    category: {
      _id: 'cat1',
      name: { en: 'AI/ML', kh: 'បញ្ញាសិប្បនិម្មិត' },
      slug: 'ai-ml',
      type: 'project',
      order: 1,
    },
    technologies: ['Python', 'YOLO', 'OpenCV', 'Angular', 'Docker'],
    mainImage: 'https://example.com/hero.jpg',
    screenshots: ['https://example.com/shot1.jpg', 'https://example.com/shot2.jpg'],
    githubUrl: 'https://github.com/example/camtraffic',
    liveUrl: 'https://camtraffic.example.com',
    videoUrl: 'https://youtube.com/watch?v=123',
    startDate: new Date('2023-01-01'),
    completionDate: new Date('2023-06-30'),
    challenges: {
      en: 'Model latency on edge devices.',
      kh: 'បញ្ហាភាពយឺតយ៉ាវនៃ Model លើ Edge Devices។',
    },
    lessonsLearned: {
      en: 'Optimizing inference speed with TensorRT.',
      kh: 'ការបង្កើនល្បឿន Inference ដោយប្រើ TensorRT។',
    },
    featured: true,
    status: 'published',
    order: 1,
    viewCount: 250,
  };

  const mockRelatedProjects: Project[] = [
    {
      _id: 'proj2',
      title: { en: 'Smart CCTV', kh: 'Smart CCTV' },
      slug: 'smart-cctv',
      shortDescription: { en: 'CCTV AI analytics', kh: 'វិភាគ CCTV' },
      fullDescription: { en: 'Full desc', kh: 'ពេញលេញ' },
      category: 'cat1',
      technologies: ['Python', 'OpenCV'],
      mainImage: 'https://example.com/cctv.jpg',
      screenshots: [],
      featured: false,
      status: 'published',
      order: 2,
      viewCount: 80,
    },
  ];

  const mockProjectResponse: ApiResponse<Project> = {
    success: true,
    message: 'Project retrieved',
    data: mockProject,
  };

  const mockRelatedResponse: PaginatedResponse<Project> = {
    success: true,
    message: 'Related projects retrieved',
    data: {
      items: [mockProject, ...mockRelatedProjects], // includes current so it should be filtered out
      pagination: { total: 2, totalPages: 1, page: 1, limit: 4, hasNextPage: false, hasPrevPage: false },
    },
  };

  beforeEach(async () => {
    portfolioServiceMock = {
      getProjectBySlug: vi.fn().mockReturnValue(of(mockProjectResponse)),
      getProjects: vi.fn().mockReturnValue(of(mockRelatedResponse)),
    };

    languageServiceMock = {
      currentLang: signal<SupportedLanguage>('en'),
      isKhmer: signal<boolean>(false),
    };

    await TestBed.configureTestingModule({
      imports: [ProjectDetailComponent],
      providers: [
        provideRouter([]),
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ slug: 'camtraffic-ai' })),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load project details and related projects on init', () => {
    fixture.detectChanges();

    expect(portfolioServiceMock.getProjectBySlug).toHaveBeenCalledWith('camtraffic-ai');
    expect(component.project()).toEqual(mockProject);
    expect(component.isLoading()).toBe(false);

    // Should load related projects and filter out current project
    expect(portfolioServiceMock.getProjects).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'ai-ml' }),
    );
    expect(component.relatedProjects().length).toBe(1);
    expect(component.relatedProjects()[0].slug).toBe('smart-cctv');
  });

  it('should parse markdown content correctly', () => {
    const html = component.renderMarkdown('## Heading\n**Bold text**');
    expect(html).toContain('<h2');
    expect(html).toContain('<strong>Bold text</strong>');

    expect(component.renderMarkdown(null)).toBe('');
    expect(component.renderMarkdown('')).toBe('');
  });

  it('should extract bilingual features and category name', () => {
    fixture.detectChanges();

    expect(component.categoryName()).toBe('AI/ML');
    expect(component.featuresList()).toEqual([
      'Real-time object detection',
      'Plate recognition',
      'Violations logging',
    ]);

    // Switch to Khmer
    languageServiceMock.currentLang.set('kh');
    fixture.detectChanges();

    expect(component.categoryName()).toBe('បញ្ញាសិប្បនិម្មិត');
    expect(component.featuresList()).toEqual([
      'ការចាប់សញ្ញារូបភាពផ្ទាល់',
      'ការស្គាល់ស្លាកលេខ',
      'ការកត់ត្រាការល្មើស',
    ]);
  });

  it('should format dates and timeline correctly', () => {
    const formatted = component.formatDate(new Date('2023-01-01'));
    expect(formatted).toBeTruthy();

    const timeline = component.formatTimeline(new Date('2023-01-01'), new Date('2023-06-30'));
    expect(timeline).toContain('–');
  });

  it('should display empty state when project is not found', () => {
    portfolioServiceMock.getProjectBySlug.mockReturnValue(
      of({ success: false, message: 'Not found', data: null as unknown as Project }),
    );

    component.loadProjectDetails('nonexistent-slug');
    fixture.detectChanges();

    expect(component.project()).toBeNull();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-empty-state')).toBeTruthy();
  });

  it('should handle API errors gracefully', () => {
    portfolioServiceMock.getProjectBySlug.mockReturnValue(throwError(() => new Error('Server error')));

    component.loadProjectDetails('camtraffic-ai');
    fixture.detectChanges();

    expect(component.error()).toBeTruthy();
    expect(component.isLoading()).toBe(false);
  });
});
