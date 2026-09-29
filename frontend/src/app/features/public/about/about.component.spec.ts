import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { AboutComponent } from './about.component';
import { PortfolioService } from '../../../core/services/portfolio.service';
import {
  LanguageService,
  SupportedLanguage,
} from '../../../core/services/language.service';
import { Profile, Education, Settings, ApiResponse } from '../../../core/models';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  let portfolioServiceMock: {
    getProfile: ReturnType<typeof vi.fn>;
    getEducation: ReturnType<typeof vi.fn>;
    getSettings: ReturnType<typeof vi.fn>;
    getCvDownloadUrl: ReturnType<typeof vi.fn>;
  };

  let languageServiceMock: {
    currentLang: ReturnType<typeof signal<SupportedLanguage>>;
    isKhmer: ReturnType<typeof signal<boolean>>;
  };

  const mockProfile: ApiResponse<Profile> = {
    success: true,
    message: 'Profile retrieved',
    data: {
      fullName: { en: 'Dim Sareach', kh: 'ឌីម សារាជ' },
      title: { en: 'Senior Software Engineer', kh: 'វិស្វករកម្មវិធីជាន់ខ្ពស់' },
      introduction: { en: 'Introduction text', kh: 'ការណែនាំ' },
      about: { en: 'Detailed about narrative', kh: 'ព័ត៌មានលម្អិតអំពីខ្ញុំ' },
      professionalSummary: { en: 'Professional summary paragraph', kh: 'សង្ខេបវិជ្ជាជីវៈ' },
      background: { en: 'Engineering background and philosophy', kh: 'ប្រវត្តិវិស្វកម្ម' },
      goals: { en: 'Long-term goals', kh: 'គោលដៅអនាគត' },
      careerInterests: { en: 'Full Stack, Cloud, AI', kh: 'បច្ចេកវិទ្យា និង AI' },
      location: { en: 'Phnom Penh, Cambodia', kh: 'ភ្នំពេញ កម្ពុជា' },
      email: 'sareach@example.com',
      strengths: {
        en: ['System Architecture', 'Problem Solving', 'Clean Code'],
        kh: ['ស្ថាបត្យកម្មប្រព័ន្ធ', 'ការដោះស្រាយបញ្ហា', 'កូដស្អាត'],
      },
    },
  };

  const mockEducation: ApiResponse<Education[]> = {
    success: true,
    message: 'Education retrieved',
    data: [
      {
        _id: 'ed1',
        institution: { en: 'Institute of Technology of Cambodia', kh: 'វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា' },
        degree: { en: "Bachelor of Engineering", kh: 'បរិញ្ញាបត្រវិស្វកម្ម' },
        field: { en: 'Information Technology', kh: 'បច្ចេកវិទ្យាព័ត៌មាន' },
        startYear: 2021,
        endYear: 2025,
        order: 1,
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
      cvDownloadCount: 0,
      enableContactForm: true,
      emailNotifications: false,
      maintenanceMode: false,
    },
  };

  beforeEach(async () => {
    portfolioServiceMock = {
      getProfile: vi.fn().mockReturnValue(of(mockProfile)),
      getEducation: vi.fn().mockReturnValue(of(mockEducation)),
      getSettings: vi.fn().mockReturnValue(of(mockSettings)),
      getCvDownloadUrl: vi.fn().mockReturnValue('http://localhost:5000/api/v1/cv/download'),
    };

    languageServiceMock = {
      currentLang: signal<SupportedLanguage>('en'),
      isKhmer: signal(false),
    };

    await TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [
        provideRouter([]),
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data and populate signals on init', () => {
    expect(portfolioServiceMock.getProfile).toHaveBeenCalled();
    expect(portfolioServiceMock.getEducation).toHaveBeenCalled();
    expect(portfolioServiceMock.getSettings).toHaveBeenCalled();

    expect(component.profile()).toEqual(mockProfile.data);
    expect(component.education().length).toBe(1);
    expect(component.isLoading()).toBe(false);
  });

  it('should render about narrative and professional summary', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Detailed about narrative');
    expect(compiled.textContent).toContain('Professional summary paragraph');
    expect(compiled.textContent).toContain('Engineering background and philosophy');
  });

  it('should compute strengths correctly for current language', () => {
    expect(component.strengthsList()).toEqual([
      'System Architecture',
      'Problem Solving',
      'Clean Code',
    ]);

    languageServiceMock.currentLang.set('kh');
    expect(component.strengthsList()).toEqual([
      'ស្ថាបត្យកម្មប្រព័ន្ធ',
      'ការដោះស្រាយបញ្ហា',
      'កូដស្អាត',
    ]);
  });

  it('should gracefully handle load errors', () => {
    portfolioServiceMock.getProfile.mockReturnValue(throwError(() => new Error('Error')));
    component.loadData();
    expect(component.isLoading()).toBe(false);
  });
});
