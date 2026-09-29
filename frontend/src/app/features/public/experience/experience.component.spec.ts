import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ExperienceComponent } from './experience.component';
import { PortfolioService } from '../../../core/services/portfolio.service';
import {
  LanguageService,
  SupportedLanguage,
} from '../../../core/services/language.service';
import { Experience, ApiResponse } from '../../../core/models';

describe('ExperienceComponent', () => {
  let component: ExperienceComponent;
  let fixture: ComponentFixture<ExperienceComponent>;

  let portfolioServiceMock: {
    getExperiences: ReturnType<typeof vi.fn>;
    getCvDownloadUrl: ReturnType<typeof vi.fn>;
  };

  let languageServiceMock: {
    currentLang: ReturnType<typeof signal<SupportedLanguage>>;
    isKhmer: ReturnType<typeof signal<boolean>>;
  };

  const mockExperiences: Experience[] = [
    {
      _id: 'exp1',
      title: { en: 'Full-Stack Engineer', kh: 'វិស្វករ Full-Stack' },
      organization: { en: 'Tech Innovations', kh: 'តិច អ៊ីណូវេសិន' },
      location: { en: 'Phnom Penh', kh: 'ភ្នំពេញ' },
      type: 'work',
      startDate: new Date('2023-01-01'),
      isCurrent: true,
      description: {
        en: 'Building scalable web applications.',
        kh: 'អភិវឌ្ឍកម្មវិធីគេហទំព័រ។',
      },
      responsibilities: {
        en: ['Designed microservices architecture', 'Led team of 4 engineers'],
        kh: ['រៀបចំស្ថាបត្យកម្ម Microservices', 'ដឹកនាំក្រុមវិស្វករ ៤ នាក់'],
      },
      technologies: ['Angular', 'Node.js', 'MongoDB'],
      order: 1,
    },
    {
      _id: 'exp2',
      title: { en: 'Junior Web Developer', kh: 'អ្នកអភិវឌ្ឍន៍វែបដំបូង' },
      organization: { en: 'Digital Lab', kh: 'ឌីជីថល ឡាប' },
      location: { en: 'Phnom Penh', kh: 'ភ្នំពេញ' },
      type: 'internship',
      startDate: new Date('2022-03-01'),
      endDate: new Date('2022-12-31'),
      isCurrent: false,
      description: {
        en: 'Frontend development and UI design.',
        kh: 'អភិវឌ្ឍ UI ផ្នែកខាងមុខ។',
      },
      responsibilities: {
        en: ['Built landing pages', 'Fixed bugs'],
        kh: ['បង្កើតទំព័រដើម', 'ជួសជុលបញ្ហា'],
      },
      technologies: ['JavaScript', 'HTML5', 'CSS3'],
      order: 2,
    },
  ];

  const mockApiResponse: ApiResponse<Experience[]> = {
    success: true,
    message: 'Experiences retrieved',
    data: mockExperiences,
  };

  beforeEach(async () => {
    portfolioServiceMock = {
      getExperiences: vi.fn().mockReturnValue(of(mockApiResponse)),
      getCvDownloadUrl: vi.fn().mockReturnValue('/api/v1/cv/download'),
    };

    languageServiceMock = {
      currentLang: signal<SupportedLanguage>('en'),
      isKhmer: signal<boolean>(false),
    };

    await TestBed.configureTestingModule({
      imports: [ExperienceComponent],
      providers: [
        provideRouter([]),
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExperienceComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load experiences on init and sort most recent first', () => {
    fixture.detectChanges();

    expect(portfolioServiceMock.getExperiences).toHaveBeenCalled();
    expect(component.experiences().length).toBe(2);
    expect(component.isLoading()).toBe(false);

    const filtered = component.filteredExperiences();
    expect(filtered.length).toBe(2);
    // exp1 is current, should be first
    expect(filtered[0]._id).toBe('exp1');
    expect(filtered[0].isCurrent).toBe(true);
  });

  it('should filter experiences by type', () => {
    fixture.detectChanges();

    component.setTypeFilter('internship');
    fixture.detectChanges();

    expect(component.selectedType()).toBe('internship');
    const filtered = component.filteredExperiences();
    expect(filtered.length).toBe(1);
    expect(filtered[0]._id).toBe('exp2');
    expect(filtered[0].type).toBe('internship');
  });

  it('should filter experiences by search query across title, org, and tech', () => {
    fixture.detectChanges();

    // Search by tech
    component.searchQuery.set('MongoDB');
    fixture.detectChanges();
    expect(component.filteredExperiences().length).toBe(1);
    expect(component.filteredExperiences()[0]._id).toBe('exp1');

    // Search by organization
    component.searchQuery.set('Digital');
    fixture.detectChanges();
    expect(component.filteredExperiences().length).toBe(1);
    expect(component.filteredExperiences()[0]._id).toBe('exp2');
  });

  it('should display empty state when search has no matches and reset correctly', () => {
    fixture.detectChanges();

    component.searchQuery.set('NonexistentCompanyXYZ');
    fixture.detectChanges();

    expect(component.filteredExperiences().length).toBe(0);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-empty-state')).toBeTruthy();

    component.resetFilters();
    fixture.detectChanges();

    expect(component.searchQuery()).toBe('');
    expect(component.selectedType()).toBe('all');
    expect(component.filteredExperiences().length).toBe(2);
  });

  it('should handle service error gracefully and retry', () => {
    portfolioServiceMock.getExperiences.mockReturnValue(throwError(() => new Error('API failure')));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.error()).toBeTruthy();
    expect(component.isLoading()).toBe(false);
    expect(component.experiences().length).toBe(0);

    // Retry
    portfolioServiceMock.getExperiences.mockReturnValue(of(mockApiResponse));
    component.loadExperiences();
    fixture.detectChanges();

    expect(component.error()).toBeNull();
    expect(component.experiences().length).toBe(2);
  });

  it('should format date ranges with Present for current positions and localized text', () => {
    const rangeCurrentEn = component.formatDateRange(new Date('2023-01-01'), undefined, true);
    expect(rangeCurrentEn).toContain('Present');

    const rangePast = component.formatDateRange(new Date('2022-03-01'), new Date('2022-12-31'), false);
    expect(rangePast).toContain('2022');

    // Khmer mode
    languageServiceMock.currentLang.set('kh');
    fixture.detectChanges();
    const rangeCurrentKh = component.formatDateRange(new Date('2023-01-01'), undefined, true);
    expect(rangeCurrentKh).toContain('បច្ចុប្បន្ន');
  });

  it('should retrieve bilingual responsibilities correctly', () => {
    const exp = mockExperiences[0];

    // English
    expect(component.getResponsibilities(exp)).toEqual([
      'Designed microservices architecture',
      'Led team of 4 engineers',
    ]);

    // Khmer
    languageServiceMock.currentLang.set('kh');
    fixture.detectChanges();

    expect(component.getResponsibilities(exp)).toEqual([
      'រៀបចំស្ថាបត្យកម្ម Microservices',
      'ដឹកនាំក្រុមវិស្វករ ៤ នាក់',
    ]);
  });

  it('should provide CV download URL from portfolio service', () => {
    expect(component.cvDownloadUrl).toBe('/api/v1/cv/download');
    expect(portfolioServiceMock.getCvDownloadUrl).toHaveBeenCalled();
  });
});
