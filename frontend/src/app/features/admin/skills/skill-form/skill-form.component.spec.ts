import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SkillFormComponent } from './skill-form.component';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Skill } from '../../../../core/models';

describe('SkillFormComponent', () => {
  let component: SkillFormComponent;
  let fixture: ComponentFixture<SkillFormComponent>;
  let router: Router;

  let portfolioServiceMock: {
    getAdminSkillById: ReturnType<typeof vi.fn>;
    createAdminSkill: ReturnType<typeof vi.fn>;
    updateAdminSkill: ReturnType<typeof vi.fn>;
  };

  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };

  const mockSkill: Skill = {
    _id: 'skill-123',
    name: 'TypeScript',
    category: { en: 'Programming Languages', kh: 'ភាសាសរសេរកម្មវិធី' },
    icon: 'devicon-typescript-plain colored',
    order: 3,
    isVisible: true,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  };

  const createComponent = async (paramId?: string) => {
    portfolioServiceMock = {
      getAdminSkillById: vi.fn().mockReturnValue(of({ success: true, data: mockSkill })),
      createAdminSkill: vi.fn().mockReturnValue(of({ success: true, data: mockSkill })),
      updateAdminSkill: vi.fn().mockReturnValue(of({ success: true, data: mockSkill })),
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
      imports: [SkillFormComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(SkillFormComponent);
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
      expect(component.skillId()).toBeNull();
      expect(component.skillForm.get('order')?.value).toBe(0);
      expect(component.skillForm.get('isVisible')?.value).toBe(true);
    });

    it('should apply preset category when clicked', () => {
      component.applyPreset({
        label: 'Cloud & DevOps',
        en: 'Cloud & DevOps',
        kh: 'ពពក និងដេវអបស៍',
      });
      expect(component.skillForm.get('category')?.value).toEqual({
        en: 'Cloud & DevOps',
        kh: 'ពពក និងដេវអបស៍',
      });
    });

    it('should identify icon URLs correctly', () => {
      expect(component.isIconUrl('https://example.com/icon.svg')).toBe(true);
      expect(component.isIconUrl('/assets/icon.png')).toBe(true);
      expect(component.isIconUrl('devicon-angularjs-plain colored')).toBe(false);
    });

    it('should reject submission if skill name is missing', () => {
      component.skillForm.patchValue({
        name: '',
        category: { en: 'Frontend', kh: 'ផ្នែកខាងមុខ' },
      });
      component.onSubmit();

      expect(notificationServiceMock.showError).toHaveBeenCalledWith('Skill name is required.');
      expect(portfolioServiceMock.createAdminSkill).not.toHaveBeenCalled();
    });

    it('should reject submission if category EN is missing', () => {
      component.skillForm.patchValue({
        name: 'Vue.js',
        category: { en: '', kh: 'ផ្នែកខាងមុខ' },
      });
      component.onSubmit();

      expect(notificationServiceMock.showError).toHaveBeenCalledWith('English category name is required.');
      expect(portfolioServiceMock.createAdminSkill).not.toHaveBeenCalled();
    });

    it('should create skill and navigate on valid form submit', () => {
      const navSpy = vi.spyOn(router, 'navigate');

      component.skillForm.patchValue({
        name: 'NestJS',
        category: { en: 'Backend', kh: 'ផ្នែកខាងក្រោយ' },
        icon: 'devicon-nestjs-plain colored',
        order: 5,
        isVisible: true,
      });

      component.onSubmit();

      expect(portfolioServiceMock.createAdminSkill).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'NestJS',
          category: { en: 'Backend', kh: 'ផ្នែកខាងក្រោយ' },
          icon: 'devicon-nestjs-plain colored',
          order: 5,
          isVisible: true,
        }),
      );
      expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Skill created successfully!');
      expect(navSpy).toHaveBeenCalledWith(['/admin/skills']);
    });

    it('should handle error when createAdminSkill fails', () => {
      portfolioServiceMock.createAdminSkill.mockReturnValue(
        throwError(() => ({ error: { message: 'Database error' } })),
      );

      component.skillForm.patchValue({
        name: 'Golang',
        category: { en: 'Backend', kh: 'ផ្នែកខាងក្រោយ' },
      });

      component.onSubmit();

      expect(component.isSubmitting()).toBe(false);
      expect(notificationServiceMock.showError).toHaveBeenCalledWith('Database error');
    });
  });

  describe('Edit Mode', () => {
    beforeEach(async () => {
      await createComponent('skill-123');
    });

    it('should initialize in edit mode and populate form from existing skill', () => {
      expect(component.isEditMode()).toBe(true);
      expect(component.skillId()).toBe('skill-123');
      expect(portfolioServiceMock.getAdminSkillById).toHaveBeenCalledWith('skill-123');

      expect(component.skillForm.get('name')?.value).toBe('TypeScript');
      expect(component.skillForm.get('category')?.value).toEqual(mockSkill.category);
      expect(component.skillForm.get('icon')?.value).toBe('devicon-typescript-plain colored');
      expect(component.skillForm.get('order')?.value).toBe(3);
    });

    it('should update skill and navigate on submit in edit mode', () => {
      const navSpy = vi.spyOn(router, 'navigate');

      component.skillForm.patchValue({
        name: 'TypeScript 5',
      });

      component.onSubmit();

      expect(portfolioServiceMock.updateAdminSkill).toHaveBeenCalledWith(
        'skill-123',
        expect.objectContaining({
          name: 'TypeScript 5',
        }),
      );
      expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Skill updated successfully!');
      expect(navSpy).toHaveBeenCalledWith(['/admin/skills']);
    });

    it('should handle error when updateAdminSkill fails', () => {
      portfolioServiceMock.updateAdminSkill.mockReturnValue(
        throwError(() => ({ error: { message: 'Failed to update' } })),
      );

      component.onSubmit();

      expect(component.isSubmitting()).toBe(false);
      expect(notificationServiceMock.showError).toHaveBeenCalledWith('Failed to update');
    });
  });

  describe('Field Validation Helper', () => {
    beforeEach(async () => {
      await createComponent();
    });

    it('should return true for invalid touched controls', () => {
      const nameCtrl = component.skillForm.get('name');
      nameCtrl?.setValue('');
      nameCtrl?.markAsTouched();

      expect(component.isFieldInvalid('name')).toBe(true);
    });

    it('should return false for valid controls', () => {
      const nameCtrl = component.skillForm.get('name');
      nameCtrl?.setValue('Rust');
      nameCtrl?.markAsTouched();

      expect(component.isFieldInvalid('name')).toBe(false);
    });

    it('should check bilingual category en presence', () => {
      const catCtrl = component.skillForm.get('category');
      catCtrl?.setValue({ en: '', kh: 'ខ្មែរ' });
      catCtrl?.markAsTouched();

      expect(component.isFieldInvalid('category')).toBe(true);

      catCtrl?.setValue({ en: 'Backend', kh: 'ខ្មែរ' });
      expect(component.isFieldInvalid('category')).toBe(false);
    });
  });
});
