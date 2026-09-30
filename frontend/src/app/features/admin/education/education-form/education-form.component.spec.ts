import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { EducationFormComponent } from './education-form.component';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Education } from '../../../../core/models';

describe('EducationFormComponent', () => {
  let component: EducationFormComponent;
  let fixture: ComponentFixture<EducationFormComponent>;
  let router: Router;

  let portfolioServiceMock: {
    getAdminEducationById: ReturnType<typeof vi.fn>;
    createAdminEducation: ReturnType<typeof vi.fn>;
    updateAdminEducation: ReturnType<typeof vi.fn>;
  };

  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };

  const mockEducation: Education = {
    _id: 'edu-123',
    institution: { en: 'Harvard University', kh: 'សាកលវិទ្យាល័យហាវើដ' },
    degree: { en: 'Master of Science', kh: 'អនុបណ្ឌិត' },
    field: { en: 'Software Engineering', kh: 'វិស្វកម្មផ្នែកទន់' },
    startYear: 2022,
    endYear: 2024,
    gpa: '3.9 / 4.0',
    description: { en: 'Focus on distributed databases', kh: 'ផ្តោតលើមូលដ្ឋានទិន្នន័យ' },
    order: 1,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  };

  const createComponent = async (paramId?: string) => {
    portfolioServiceMock = {
      getAdminEducationById: vi.fn().mockReturnValue(of({ success: true, data: mockEducation })),
      createAdminEducation: vi.fn().mockReturnValue(of({ success: true, data: mockEducation })),
      updateAdminEducation: vi.fn().mockReturnValue(of({ success: true, data: mockEducation })),
    };

    notificationServiceMock = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    const activatedRouteMock = {
      snapshot: {
        paramMap: convertToParamMap(paramId ? { id: paramId } : {}),
      },
    };

    await TestBed.configureTestingModule({
      imports: [EducationFormComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(EducationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('Create Mode', () => {
    beforeEach(async () => {
      await createComponent();
    });

    it('should create the component in create mode by default', () => {
      expect(component).toBeTruthy();
      expect(component.isEditMode()).toBe(false);
      expect(component.educationId()).toBeNull();
      expect(component.educationForm.get('order')?.value).toBe(0);
    });

    it('should reject submission if institution EN is missing', () => {
      component.educationForm.patchValue({
        institution: { en: '', kh: 'សាលា' },
        degree: { en: 'BS', kh: '' },
        field: { en: 'CS', kh: '' },
        startYear: 2020,
      });
      component.onSubmit();

      expect(notificationServiceMock.showError).toHaveBeenCalledWith('English institution name is required.');
      expect(portfolioServiceMock.createAdminEducation).not.toHaveBeenCalled();
    });

    it('should reject submission if degree EN is missing', () => {
      component.educationForm.patchValue({
        institution: { en: 'MIT', kh: '' },
        degree: { en: '', kh: 'បរិញ្ញាបត្រ' },
        field: { en: 'CS', kh: '' },
        startYear: 2020,
      });
      component.onSubmit();

      expect(notificationServiceMock.showError).toHaveBeenCalledWith('English degree title is required.');
      expect(portfolioServiceMock.createAdminEducation).not.toHaveBeenCalled();
    });

    it('should reject submission if field EN is missing', () => {
      component.educationForm.patchValue({
        institution: { en: 'MIT', kh: '' },
        degree: { en: 'BS', kh: '' },
        field: { en: '', kh: 'ជំនាញ' },
        startYear: 2020,
      });
      component.onSubmit();

      expect(notificationServiceMock.showError).toHaveBeenCalledWith('English field of study is required.');
      expect(portfolioServiceMock.createAdminEducation).not.toHaveBeenCalled();
    });

    it('should create education and navigate on valid form submit', () => {
      const navSpy = vi.spyOn(router, 'navigate');

      component.educationForm.patchValue({
        institution: { en: 'Berkeley', kh: 'ប៊ើកលី' },
        degree: { en: 'B.S.', kh: 'បរិញ្ញាបត្រ' },
        field: { en: 'Data Science', kh: 'វិទ្យាសាស្ត្រទិន្នន័យ' },
        startYear: 2020,
        endYear: 2024,
        gpa: '3.9',
      });

      component.onSubmit();

      expect(portfolioServiceMock.createAdminEducation).toHaveBeenCalledWith(
        expect.objectContaining({
          startYear: 2020,
          endYear: 2024,
        }),
      );
      expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Education record created successfully!');
      expect(navSpy).toHaveBeenCalledWith(['/admin/education']);
    });

    it('should handle error when createAdminEducation fails', () => {
      portfolioServiceMock.createAdminEducation.mockReturnValue(
        throwError(() => ({ error: { message: 'Database constraint error' } })),
      );

      component.educationForm.patchValue({
        institution: { en: 'Berkeley', kh: '' },
        degree: { en: 'B.S.', kh: '' },
        field: { en: 'CS', kh: '' },
        startYear: 2020,
      });

      component.onSubmit();

      expect(component.isSubmitting()).toBe(false);
      expect(notificationServiceMock.showError).toHaveBeenCalledWith('Database constraint error');
    });
  });

  describe('Edit Mode', () => {
    beforeEach(async () => {
      await createComponent('edu-123');
    });

    it('should initialize in edit mode and populate form from existing education', () => {
      expect(component.isEditMode()).toBe(true);
      expect(component.educationId()).toBe('edu-123');
      expect(portfolioServiceMock.getAdminEducationById).toHaveBeenCalledWith('edu-123');

      expect(component.educationForm.get('institution')?.value).toEqual(mockEducation.institution);
      expect(component.educationForm.get('degree')?.value).toEqual(mockEducation.degree);
      expect(component.educationForm.get('startYear')?.value).toBe(2022);
      expect(component.educationForm.get('endYear')?.value).toBe(2024);
    });

    it('should update education and navigate on submit in edit mode', () => {
      const navSpy = vi.spyOn(router, 'navigate');

      component.educationForm.patchValue({
        endYear: 2025,
      });

      component.onSubmit();

      expect(portfolioServiceMock.updateAdminEducation).toHaveBeenCalledWith(
        'edu-123',
        expect.objectContaining({
          endYear: 2025,
        }),
      );
      expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Education record updated successfully!');
      expect(navSpy).toHaveBeenCalledWith(['/admin/education']);
    });

    it('should handle error when updateAdminEducation fails', () => {
      portfolioServiceMock.updateAdminEducation.mockReturnValue(
        throwError(() => ({ error: { message: 'Update failed' } })),
      );

      component.onSubmit();

      expect(component.isSubmitting()).toBe(false);
      expect(notificationServiceMock.showError).toHaveBeenCalledWith('Update failed');
    });
  });

  describe('Field Validation Helper', () => {
    beforeEach(async () => {
      await createComponent();
    });

    it('should return true for invalid touched controls', () => {
      const startYearCtrl = component.educationForm.get('startYear');
      startYearCtrl?.setValue(null);
      startYearCtrl?.markAsTouched();

      expect(component.isFieldInvalid('startYear')).toBe(true);
    });

    it('should validate bilingual degree correctly', () => {
      const degCtrl = component.educationForm.get('degree');
      degCtrl?.setValue({ en: '', kh: 'ខ្មែរ' });
      degCtrl?.markAsTouched();

      expect(component.isFieldInvalid('degree')).toBe(true);

      degCtrl?.setValue({ en: 'Bachelor of Arts', kh: 'ខ្មែរ' });
      expect(component.isFieldInvalid('degree')).toBe(false);
    });
  });
});
