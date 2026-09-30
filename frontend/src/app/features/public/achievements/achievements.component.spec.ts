import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { AchievementsComponent } from './achievements.component';
import { PortfolioService } from '../../../core/services/portfolio.service';
import {
  LanguageService,
  SupportedLanguage,
} from '../../../core/services/language.service';
import { Certification, ApiResponse } from '../../../core/models';

describe('AchievementsComponent', () => {
  let component: AchievementsComponent;
  let fixture: ComponentFixture<AchievementsComponent>;

  let portfolioServiceMock: {
    getCertifications: ReturnType<typeof vi.fn>;
  };

  let languageServiceMock: {
    currentLang: ReturnType<typeof signal<SupportedLanguage>>;
    isKhmer: ReturnType<typeof signal<boolean>>;
  };

  const mockCertifications: Certification[] = [
    {
      _id: 'cert1',
      name: { en: 'AWS Certified Solutions Architect', kh: 'វិញ្ញាបនបត្រ AWS Solutions Architect' },
      type: 'certification',
      organization: { en: 'Amazon Web Services', kh: 'Amazon Web Services' },
      issueDate: new Date('2025-05-10'),
      expirationDate: new Date('2028-05-10'),
      credentialId: 'AWS-12345',
      credentialUrl: 'https://aws.amazon.com/verify/12345',
      isVisible: true,
      order: 1,
    },
    {
      _id: 'cert2',
      name: { en: 'National Hackathon Champion', kh: 'ជើងឯកការប្រកួត Hackathon ថ្នាក់ជាតិ' },
      type: 'award',
      organization: { en: 'Ministry of Tech', kh: 'ក្រសួងបច្ចេកវិទ្យា' },
      issueDate: new Date('2025-11-20'),
      credentialId: 'HACK-2025-01',
      isVisible: true,
      order: 2,
    },
    {
      _id: 'cert3',
      name: { en: 'Top Open Source Contributor', kh: 'អ្នកចូលរួមចំណែក Open Source ឆ្នើម' },
      type: 'achievement',
      organization: { en: 'Developer Community', kh: 'សហគមន៍អ្នកអភិវឌ្ឍន៍' },
      issueDate: new Date('2026-02-15'),
      isVisible: true,
      order: 3,
    },
  ];

  const mockResponse: ApiResponse<Certification[]> = {
    success: true,
    message: 'Certifications loaded',
    data: mockCertifications,
  };

  beforeEach(async () => {
    portfolioServiceMock = {
      getCertifications: vi.fn().mockReturnValue(of(mockResponse)),
    };

    languageServiceMock = {
      currentLang: signal<SupportedLanguage>('en'),
      isKhmer: signal<boolean>(false),
    };

    await TestBed.configureTestingModule({
      imports: [AchievementsComponent],
      providers: [
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AchievementsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load certifications on init and compute counts', () => {
    fixture.detectChanges();

    expect(portfolioServiceMock.getCertifications).toHaveBeenCalled();
    expect(component.items().length).toBe(3);
    expect(component.totalCount()).toBe(3);
    expect(component.certificationsCount()).toBe(1);
    expect(component.awardsCount()).toBe(1);
    expect(component.achievementsCount()).toBe(1);
    expect(component.isLoading()).toBe(false);
  });

  it('should filter items by type tabs', () => {
    fixture.detectChanges();

    component.onTypeSelect('certification');
    expect(component.selectedType()).toBe('certification');
    expect(component.displayedItems().length).toBe(1);
    expect(component.displayedItems()[0].type).toBe('certification');

    component.onTypeSelect('award');
    expect(component.displayedItems().length).toBe(1);
    expect(component.displayedItems()[0].type).toBe('award');

    component.onTypeSelect('achievement');
    expect(component.displayedItems().length).toBe(1);
    expect(component.displayedItems()[0].type).toBe('achievement');

    component.onTypeSelect('all');
    expect(component.displayedItems().length).toBe(3);
  });

  it('should copy credential ID to clipboard', () => {
    fixture.detectChanges();

    const clipboardMock = {
      writeText: vi.fn().mockResolvedValue(undefined),
    };
    Object.assign(navigator, { clipboard: clipboardMock });

    component.copyCredentialId('cert1', 'AWS-12345');
    expect(clipboardMock.writeText).toHaveBeenCalledWith('AWS-12345');
    expect(component.copiedId()).toBe('cert1');
  });

  it('should handle errors gracefully and allow retry', () => {
    portfolioServiceMock.getCertifications.mockReturnValue(throwError(() => new Error('Server error')));

    component.loadCertifications();
    fixture.detectChanges();

    expect(component.error()).toBeTruthy();
    expect(component.isLoading()).toBe(false);

    // Retry
    portfolioServiceMock.getCertifications.mockReturnValue(of(mockResponse));
    component.loadCertifications();
    fixture.detectChanges();

    expect(component.error()).toBeNull();
    expect(component.items().length).toBe(3);
  });

  it('should display empty state when no items match', () => {
    portfolioServiceMock.getCertifications.mockReturnValue(
      of({ success: true, message: 'Empty', data: [] }),
    );

    component.loadCertifications();
    fixture.detectChanges();

    expect(component.displayedItems().length).toBe(0);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-empty-state')).toBeTruthy();
  });

  it('should format dates and type labels properly in bilingual mode', () => {
    fixture.detectChanges();

    expect(component.getTypeLabel('award')).toBe('Award');
    expect(component.getTypeLabel('achievement')).toBe('Achievement');
    expect(component.getTypeLabel('certification')).toBe('Certification');

    languageServiceMock.currentLang.set('kh');
    fixture.detectChanges();

    expect(component.getTypeLabel('award')).toBe('ពានរង្វាន់');
    expect(component.getTypeLabel('achievement')).toBe('សមិទ្ធផល');
    expect(component.getTypeLabel('certification')).toBe('វិញ្ញាបនបត្រ');
  });
});
