import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { EducationComponent } from './education.component';
import { PortfolioService } from '../../../core/services/portfolio.service';
import {
  LanguageService,
  SupportedLanguage,
} from '../../../core/services/language.service';
import { Education, Certification, ApiResponse } from '../../../core/models';

describe('EducationComponent', () => {
  let component: EducationComponent;
  let fixture: ComponentFixture<EducationComponent>;

  let portfolioServiceMock: {
    getEducation: ReturnType<typeof vi.fn>;
    getCertifications: ReturnType<typeof vi.fn>;
  };

  let languageServiceMock: {
    currentLang: ReturnType<typeof signal<SupportedLanguage>>;
    isKhmer: ReturnType<typeof signal<boolean>>;
  };

  const mockEducation: Education[] = [
    {
      _id: 'edu1',
      institution: {
        en: 'Royal University of Phnom Penh',
        kh: 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ',
      },
      degree: { en: 'Bachelor of Science', kh: 'បរិញ្ញាបត្រវិទ្យាសាស្ត្រ' },
      field: { en: 'Computer Science', kh: 'វិទ្យាសាស្ត្រកុំព្យូទ័រ' },
      startYear: 2020,
      endYear: 2024,
      gpa: '3.85 / 4.00',
      description: {
        en: 'Focused on software engineering and algorithms.',
        kh: 'ផ្តោតលើវិស្វកម្មសូហ្វវែរ និងក្បួនដោះស្រាយ។',
      },
      activities: {
        en: ['Lead Organizer of RUPP Hackathon', 'Top 5 Finalist in National Contest'],
        kh: ['ប្រធានរៀបចំ RUPP Hackathon', 'ជ័យលាភីកំពូលទាំង ៥'],
      },
      order: 1,
    },
    {
      _id: 'edu2',
      institution: {
        en: 'Institute of Technology of Cambodia',
        kh: 'វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា',
      },
      degree: { en: 'Master of Science', kh: 'អនុបណ្ឌិត' },
      field: { en: 'Software Systems', kh: 'ប្រព័ន្ធសូហ្វវែរ' },
      startYear: 2025,
      endYear: undefined, // Currently studying
      description: {
        en: 'Advanced distributed systems research.',
        kh: 'ការស្រាវជ្រាវប្រព័ន្ធចែកចាយកម្រិតខ្ពស់។',
      },
      activities: {
        en: ['Graduate Research Assistant'],
        kh: ['ជំនួយការស្រាវជ្រាវថ្នាក់ក្រោយបរិញ្ញាបត្រ'],
      },
      order: 2,
    },
  ];

  const mockCertifications: Certification[] = [
    {
      _id: 'cert1',
      name: { en: 'AWS Certified Cloud Practitioner', kh: 'AWS Certified Cloud Practitioner' },
      type: 'certification',
      organization: { en: 'Amazon Web Services', kh: 'Amazon Web Services' },
      issueDate: '2023-08-01',
      credentialUrl: 'https://aws.amazon.com/verify/12345',
      isVisible: true,
      order: 1,
    },
  ];

  const mockEduResponse: ApiResponse<Education[]> = {
    success: true,
    message: 'Education retrieved',
    data: mockEducation,
  };

  const mockCertResponse: ApiResponse<Certification[]> = {
    success: true,
    message: 'Certifications retrieved',
    data: mockCertifications,
  };

  beforeEach(async () => {
    portfolioServiceMock = {
      getEducation: vi.fn().mockReturnValue(of(mockEduResponse)),
      getCertifications: vi.fn().mockReturnValue(of(mockCertResponse)),
    };

    languageServiceMock = {
      currentLang: signal<SupportedLanguage>('en'),
      isKhmer: signal<boolean>(false),
    };

    await TestBed.configureTestingModule({
      imports: [EducationComponent],
      providers: [
        provideRouter([]),
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EducationComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load education and certifications on init', () => {
    fixture.detectChanges();

    expect(portfolioServiceMock.getEducation).toHaveBeenCalled();
    expect(portfolioServiceMock.getCertifications).toHaveBeenCalled();
    expect(component.education().length).toBe(2);
    expect(component.certifications().length).toBe(1);
    expect(component.isLoading()).toBe(false);
  });

  it('should correctly determine currently studying status and format year ranges', () => {
    const currentEdu = mockEducation[1]; // no endYear
    expect(component.isCurrentlyStudying(currentEdu)).toBe(true);
    expect(component.formatYearRange(currentEdu)).toBe('2025 – Present');

    const completedEdu = mockEducation[0]; // 2020-2024
    expect(component.formatYearRange(completedEdu)).toBe('2020 – 2024');

    // In Khmer mode
    languageServiceMock.currentLang.set('kh');
    fixture.detectChanges();
    expect(component.formatYearRange(currentEdu)).toBe('2025 – បច្ចុប្បន្ន');
  });

  it('should retrieve bilingual activities accurately', () => {
    const edu = mockEducation[0];

    // English
    expect(component.getActivities(edu)).toEqual([
      'Lead Organizer of RUPP Hackathon',
      'Top 5 Finalist in National Contest',
    ]);

    // Khmer
    languageServiceMock.currentLang.set('kh');
    fixture.detectChanges();
    expect(component.getActivities(edu)).toEqual([
      'ប្រធានរៀបចំ RUPP Hackathon',
      'ជ័យលាភីកំពូលទាំង ៥',
    ]);
  });

  it('should display empty state when education array is empty', () => {
    portfolioServiceMock.getEducation.mockReturnValue(of({ success: true, message: 'Empty', data: [] }));
    portfolioServiceMock.getCertifications.mockReturnValue(of({ success: true, message: 'Empty', data: [] }));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.education().length).toBe(0);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-empty-state')).toBeTruthy();
  });

  it('should handle service errors gracefully', () => {
    portfolioServiceMock.getEducation.mockReturnValue(throwError(() => new Error('Service down')));
    portfolioServiceMock.getCertifications.mockReturnValue(throwError(() => new Error('Service down')));

    component.ngOnInit();
    fixture.detectChanges();

    // Since catchError wraps with of(null), education becomes []
    expect(component.isLoading()).toBe(false);
    expect(component.education().length).toBe(0);
  });

  it('should render certifications section when credentials exist', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('AWS Certified Cloud Practitioner');
    expect(compiled.textContent).toContain('Amazon Web Services');
  });
});
