import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ExperienceFormComponent } from './experience-form.component';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Experience } from '../../../../core/models';

describe('ExperienceFormComponent', () => {
  let component: ExperienceFormComponent;
  let fixture: ComponentFixture<ExperienceFormComponent>;
  let router: Router;

  let portfolioServiceMock: {
    getAdminExperienceById: ReturnType<typeof vi.fn>;
    createAdminExperience: ReturnType<typeof vi.fn>;
    updateAdminExperience: ReturnType<typeof vi.fn>;
  };

  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };

  const mockExperience: Experience = {
    _id: 'exp-123',
    title: { en: 'Principal Architect', kh: 'ស្ថាបត្យករចម្បង' },
    organization: { en: 'Nexus Tech', kh: 'ណិចសឹស' },
    location: { en: 'Remote', kh: 'ពីចម្ងាយ' },
    type: 'work',
    startDate: '2024-01-01T00:00:00.000Z',
    endDate: '2024-12-31T00:00:00.000Z',
    isCurrent: false,
    description: { en: 'Cloud architecture design', kh: 'ការរចនាពពក' },
    technologies: ['Kubernetes', 'Go', 'GCP'],
    order: 1,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  };

  const createComponent = async (paramId?: string) => {
    portfolioServiceMock = {
      getAdminExperienceById: vi.fn().mockReturnValue(of({ success: true, data: mockExperience })),
      createAdminExperience: vi.fn().mockReturnValue(of({ success: true, data: mockExperience })),
      updateAdminExperience: vi.fn().mockReturnValue(of({ success: true, data: mockExperience })),
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
      imports: [ExperienceFormComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ExperienceFormComponent);
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
      expect(component.experienceId()).toBeNull();
      expect(component.experienceForm.get('type')?.value).toBe('work');
      expect(component.experienceForm.get('isCurrent')?.value).toBe(false);
    });

    it('should add and remove technology tags', () => {
      component.newTagInput = 'Docker';
      component.addTechTag();
      expect(component.techTags()).toContain('Docker');
      expect(component.newTagInput).toBe('');

      // Avoid duplicates
      component.newTagInput = 'Docker';
      component.addTechTag();
      expect(component.techTags().filter((t) => t === 'Docker').length).toBe(1);

      // Remove tag
      component.removeTechTag('Docker');
      expect(component.techTags()).not.toContain('Docker');
    });

    it('should clear endDate when isCurrent is toggled true', () => {
      component.experienceForm.patchValue({
        endDate: '2025-01-01',
        isCurrent: true,
      });
      component.onCurrentStatusToggle();
      expect(component.experienceForm.get('endDate')?.value).toBe('');
    });

    it('should reject submission if title EN is missing', () => {
      component.experienceForm.patchValue({
        title: { en: '', kh: 'តួនាទី' },
        organization: { en: 'Acme', kh: '' },
        startDate: '2025-01-01',
      });
      component.onSubmit();

      expect(notificationServiceMock.showError).toHaveBeenCalledWith('English position title is required.');
      expect(portfolioServiceMock.createAdminExperience).not.toHaveBeenCalled();
    });

    it('should reject submission if organization EN is missing', () => {
      component.experienceForm.patchValue({
        title: { en: 'Engineer', kh: '' },
        organization: { en: '', kh: 'ស្ថាប័ន' },
        startDate: '2025-01-01',
      });
      component.onSubmit();

      expect(notificationServiceMock.showError).toHaveBeenCalledWith('English organization name is required.');
      expect(portfolioServiceMock.createAdminExperience).not.toHaveBeenCalled();
    });

    it('should create experience and navigate on valid form submit', () => {
      const navSpy = vi.spyOn(router, 'navigate');

      component.experienceForm.patchValue({
        title: { en: 'Full Stack Developer', kh: 'អ្នកអភិវឌ្ឍ' },
        organization: { en: 'Global Labs', kh: 'មន្ទីរពិសោធន៍' },
        location: { en: 'Phnom Penh', kh: 'ភ្នំពេញ' },
        type: 'work',
        startDate: '2024-03-01',
        isCurrent: true,
        description: { en: 'Building web applications', kh: '' },
      });
      component.techTags.set(['Angular', 'PostgreSQL']);

      component.onSubmit();

      expect(portfolioServiceMock.createAdminExperience).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'work',
          technologies: ['Angular', 'PostgreSQL'],
        }),
      );
      expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Experience created successfully!');
      expect(navSpy).toHaveBeenCalledWith(['/admin/experience']);
    });

    it('should handle error when createAdminExperience fails', () => {
      portfolioServiceMock.createAdminExperience.mockReturnValue(
        throwError(() => ({ error: { message: 'Server validation error' } })),
      );

      component.experienceForm.patchValue({
        title: { en: 'Developer', kh: '' },
        organization: { en: 'Startup', kh: '' },
        startDate: '2024-01-01',
      });

      component.onSubmit();

      expect(component.isSubmitting()).toBe(false);
      expect(notificationServiceMock.showError).toHaveBeenCalledWith('Server validation error');
    });
  });

  describe('Edit Mode', () => {
    beforeEach(async () => {
      await createComponent('exp-123');
    });

    it('should initialize in edit mode and populate form from existing experience', () => {
      expect(component.isEditMode()).toBe(true);
      expect(component.experienceId()).toBe('exp-123');
      expect(portfolioServiceMock.getAdminExperienceById).toHaveBeenCalledWith('exp-123');

      expect(component.experienceForm.get('title')?.value).toEqual(mockExperience.title);
      expect(component.experienceForm.get('organization')?.value).toEqual(mockExperience.organization);
      expect(component.techTags()).toEqual(['Kubernetes', 'Go', 'GCP']);
    });

    it('should update experience and navigate on submit in edit mode', () => {
      const navSpy = vi.spyOn(router, 'navigate');

      component.experienceForm.patchValue({
        title: { en: 'Distinguished Architect', kh: 'ស្ថាបត្យករ' },
      });

      component.onSubmit();

      expect(portfolioServiceMock.updateAdminExperience).toHaveBeenCalledWith(
        'exp-123',
        expect.objectContaining({
          technologies: ['Kubernetes', 'Go', 'GCP'],
        }),
      );
      expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Experience updated successfully!');
      expect(navSpy).toHaveBeenCalledWith(['/admin/experience']);
    });

    it('should handle error when updateAdminExperience fails', () => {
      portfolioServiceMock.updateAdminExperience.mockReturnValue(
        throwError(() => ({ error: { message: 'Failed to update entry' } })),
      );

      component.onSubmit();

      expect(component.isSubmitting()).toBe(false);
      expect(notificationServiceMock.showError).toHaveBeenCalledWith('Failed to update entry');
    });
  });

  describe('Field Validation Helper', () => {
    beforeEach(async () => {
      await createComponent();
    });

    it('should return true for invalid touched controls', () => {
      const startCtrl = component.experienceForm.get('startDate');
      startCtrl?.setValue('');
      startCtrl?.markAsTouched();

      expect(component.isFieldInvalid('startDate')).toBe(true);
    });

    it('should validate bilingual title correctly', () => {
      const titleCtrl = component.experienceForm.get('title');
      titleCtrl?.setValue({ en: '', kh: 'ខ្មែរ' });
      titleCtrl?.markAsTouched();

      expect(component.isFieldInvalid('title')).toBe(true);

      titleCtrl?.setValue({ en: 'Staff Engineer', kh: 'ខ្មែរ' });
      expect(component.isFieldInvalid('title')).toBe(false);
    });
  });
});
