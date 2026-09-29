import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { HomeComponent } from './home.component';
import { PortfolioService } from '../../../core/services/portfolio.service';
import {
  LanguageService,
  SupportedLanguage,
} from '../../../core/services/language.service';
import {
  Profile,
  Project,
  Skill,
  Experience,
  Education,
  SocialLink,
  Settings,
  ApiResponse,
  PaginatedResponse,
} from '../../../core/models';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  let portfolioServiceMock: {
    getProfile: ReturnType<typeof vi.fn>;
    getFeaturedProjects: ReturnType<typeof vi.fn>;
    getSkills: ReturnType<typeof vi.fn>;
    getExperiences: ReturnType<typeof vi.fn>;
    getEducation: ReturnType<typeof vi.fn>;
    getSocialLinks: ReturnType<typeof vi.fn>;
    getSettings: ReturnType<typeof vi.fn>;
    getCvDownloadUrl: ReturnType<typeof vi.fn>;
  };

  let languageServiceMock: {
    currentLang: ReturnType<typeof signal<SupportedLanguage>>;
    isKhmer: ReturnType<typeof signal<boolean>>;
    setLanguage: ReturnType<typeof vi.fn>;
    toggleLanguage: ReturnType<typeof vi.fn>;
  };

  const mockProfile: ApiResponse<Profile> = {
    success: true,
    message: 'Profile retrieved',
    data: {
      fullName: { en: 'Dim Sareach', kh: 'ឌីម សារាជ' },
      title: { en: 'Senior Full Stack Engineer', kh: 'វិស្វករកម្មវិធីជាន់ខ្ពស់' },
      introduction: {
        en: 'Passionate about distributed systems and AI applications.',
        kh: 'មានចំណង់ចំណូលចិត្តលើប្រព័ន្ធកុំព្យូទ័រ និងកម្មវិធី AI។',
      },
      about: { en: 'About Dim Sareach', kh: 'អំពី ឌីម សារាជ' },
      profileImage: 'https://example.com/avatar.jpg',
    },
  };

  const mockProjects: PaginatedResponse<Project> = {
    success: true,
    message: 'Projects retrieved',
    data: {
      items: [
        {
          _id: 'p1',
          title: { en: 'AI Document Intelligence', kh: 'ប្រព័ន្ធវៃឆ្លាត AI' },
          slug: 'ai-doc-intel',
          shortDescription: {
            en: 'OCR and document parsing pipeline using deep learning.',
            kh: 'ប្រព័ន្ធវិភាគឯកសារស្វ័យប្រវត្តិ។',
          },
          fullDescription: { en: 'Full description', kh: 'ការពិពណ៌នាពេញលេញ' },
          technologies: ['Python', 'FastAPI', 'PyTorch', 'Angular'],
          category: 'AI / ML',
          mainImage: 'https://example.com/proj1.jpg',
          screenshots: [],
          featured: true,
          status: 'published',
          order: 1,
          viewCount: 150,
        },
      ],
      pagination: {
        page: 1,
        limit: 3,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    },
  };

  const mockSkills: ApiResponse<Skill[]> = {
    success: true,
    message: 'Skills retrieved',
    data: [
      {
        _id: 's1',
        name: 'Angular',
        category: { en: 'Frontend', kh: 'ផ្នែកខាងមុខ' },
        order: 1,
        isVisible: true,
      },
      {
        _id: 's2',
        name: 'Node.js',
        category: { en: 'Backend', kh: 'ផ្នែកខាងក្រោយ' },
        order: 2,
        isVisible: true,
      },
    ],
  };

  const mockExperiences: ApiResponse<Experience[]> = {
    success: true,
    message: 'Experiences retrieved',
    data: [
      {
        _id: 'e1',
        title: { en: 'Lead Developer', kh: 'ប្រធានអ្នកអភិវឌ្ឍន៍' },
        organization: { en: 'Tech Corp', kh: 'ក្រុមហ៊ុនតិចខប' },
        type: 'work',
        startDate: '2023-01-01',
        isCurrent: true,
        description: { en: 'Building scalable microservices', kh: 'បង្កើតប្រព័ន្ធ' },
        technologies: ['TypeScript', 'Docker', 'MongoDB'],
        order: 1,
      },
    ],
  };

  const mockEducation: ApiResponse<Education[]> = {
    success: true,
    message: 'Education retrieved',
    data: [
      {
        _id: 'ed1',
        institution: { en: 'Institute of Technology of Cambodia', kh: 'វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា' },
        degree: { en: "Bachelor's Degree", kh: 'បរិញ្ញាបត្រ' },
        field: { en: 'Computer Science', kh: 'វិទ្យាសាស្ត្រកុំព្យូទ័រ' },
        startYear: 2021,
        endYear: 2025,
        order: 1,
      },
    ],
  };

  const mockSocialLinks: ApiResponse<SocialLink[]> = {
    success: true,
    message: 'Social links retrieved',
    data: [
      {
        _id: 'sl1',
        platform: 'github',
        label: 'GitHub',
        url: 'https://github.com/dimsareach',
        order: 1,
        isVisible: true,
      },
    ],
  };

  const mockSettings: ApiResponse<Settings> = {
    success: true,
    message: 'Settings retrieved',
    data: {
      siteTitle: { en: 'Sareach Portfolio', kh: 'ផលប័ត្រសារាជ' },
      siteDescription: { en: 'Portfolio description', kh: 'ការពិពណ៌នា' },
      enableCvDownload: true,
      cvDownloadCount: 42,
      enableContactForm: true,
      emailNotifications: true,
      maintenanceMode: false,
    },
  };

  beforeEach(async () => {
    portfolioServiceMock = {
      getProfile: vi.fn().mockReturnValue(of(mockProfile)),
      getFeaturedProjects: vi.fn().mockReturnValue(of(mockProjects)),
      getSkills: vi.fn().mockReturnValue(of(mockSkills)),
      getExperiences: vi.fn().mockReturnValue(of(mockExperiences)),
      getEducation: vi.fn().mockReturnValue(of(mockEducation)),
      getSocialLinks: vi.fn().mockReturnValue(of(mockSocialLinks)),
      getSettings: vi.fn().mockReturnValue(of(mockSettings)),
      getCvDownloadUrl: vi.fn().mockReturnValue('http://localhost:5000/api/v1/cv/download'),
    };

    languageServiceMock = {
      currentLang: signal<SupportedLanguage>('en'),
      isKhmer: signal(false),
      setLanguage: vi.fn(),
      toggleLanguage: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter([]),
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all home data on initialization', () => {
    expect(portfolioServiceMock.getProfile).toHaveBeenCalled();
    expect(portfolioServiceMock.getFeaturedProjects).toHaveBeenCalledWith(3);
    expect(portfolioServiceMock.getSkills).toHaveBeenCalled();
    expect(portfolioServiceMock.getExperiences).toHaveBeenCalled();
    expect(portfolioServiceMock.getEducation).toHaveBeenCalled();
    expect(portfolioServiceMock.getSocialLinks).toHaveBeenCalled();
    expect(portfolioServiceMock.getSettings).toHaveBeenCalled();

    expect(component.profile()).toEqual(mockProfile.data);
    expect(component.featuredProjects()).toEqual(mockProjects.data.items);
    expect(component.skills().length).toBe(2);
    expect(component.experiences().length).toBe(1);
    expect(component.latestEducation()).toEqual(mockEducation.data[0]);
    expect(component.socialLinks().length).toBe(1);
    expect(component.isLoading()).toBe(false);
  });

  it('should render profile name and title in hero section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Dim Sareach');
    expect(compiled.textContent).toContain('Senior Full Stack Engineer');
  });

  it('should group skills by category correctly', () => {
    const grouped = component.skillsGrouped();
    expect(grouped.length).toBe(2);
    expect(grouped.some((g) => g.categoryName === 'Frontend')).toBe(true);
    expect(grouped.some((g) => g.categoryName === 'Backend')).toBe(true);
  });

  it('should format years safely', () => {
    expect(component.formatYear('2023-05-15')).toBe('2023');
    expect(component.formatYear(undefined)).toBe('');
  });

  it('should handle service errors gracefully during data loading', () => {
    portfolioServiceMock.getProfile.mockReturnValue(throwError(() => new Error('API down')));
    portfolioServiceMock.getFeaturedProjects.mockReturnValue(throwError(() => new Error('API down')));

    component.loadHomeData();

    expect(component.isLoading()).toBe(false);
  });
});
