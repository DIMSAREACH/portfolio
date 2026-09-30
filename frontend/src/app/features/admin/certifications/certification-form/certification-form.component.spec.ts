import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CertificationFormComponent } from './certification-form.component';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Certification } from '../../../../core/models';

describe('CertificationFormComponent', () => {
  let component: CertificationFormComponent;
  let fixture: ComponentFixture<CertificationFormComponent>;
  let router: Router;

  let portfolioServiceMock: {
    getAdminCertificationById: ReturnType<typeof vi.fn>;
    createAdminCertification: ReturnType<typeof vi.fn>;
    updateAdminCertification: ReturnType<typeof vi.fn>;
  };

  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };

  const mockCert: Certification = {
    _id: 'cert-123',
    name: { en: 'Google Cloud Professional Architect', kh: 'ស្ថាបត្យករ Google Cloud' },
    type: 'certification',
    organization: { en: 'Google Cloud', kh: 'ហ្គូហ្គល' },
    issueDate: '2024-03-01T00:00:00.000Z',
    expirationDate: '2026-03-01T00:00:00.000Z',
    credentialId: 'GCP-PCA-999',
    credentialUrl: 'https://google.com/cert/999',
    image: 'https://example.com/badge.png',
    description: { en: 'Enterprise cloud design', kh: 'ការរចនាពពក' },
    isVisible: true,
    order: 1,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  };

  const createComponent = async (paramId?: string) => {
    portfolioServiceMock = {
      getAdminCertificationById: vi.fn().mockReturnValue(of({ success: true, data: mockCert })),
      createAdminCertification: vi.fn().mockReturnValue(of({ success: true, data: mockCert })),
      updateAdminCertification: vi.fn().mockReturnValue(of({ success: true, data: mockCert })),
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
      imports: [CertificationFormComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CertificationFormComponent);
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
      expect(component.certId()).toBeNull();
      expect(component.certForm.get('type')?.value).toBe('certification');
      expect(component.certForm.get('isVisible')?.value).toBe(true);
      expect(component.certForm.get('order')?.value).toBe(0);
    });

    it('should handle image file selection and removal', () => {
      const mockFile = new File(['badge'], 'badge.png', { type: 'image/png' });
      component.onImageSelected(mockFile);
      expect(component.selectedImageFile).toBe(mockFile);
      expect(component.certForm.get('image')?.value).toBe('file://badge.png');

      component.onImageRemoved();
      expect(component.selectedImageFile).toBeNull();
      expect(component.certForm.get('image')?.value).toBe('');
    });

    it('should reject submission if credential name is missing', () => {
      component.certForm.patchValue({
        name: { en: '', kh: 'វិញ្ញាបនបត្រ' },
        organization: { en: 'Google', kh: '' },
        issueDate: '2024-01-01',
      });
      component.onSubmit();

      expect(notificationServiceMock.showError).toHaveBeenCalledWith('English credential name is required.');
      expect(portfolioServiceMock.createAdminCertification).not.toHaveBeenCalled();
    });

    it('should reject submission if organization EN is missing', () => {
      component.certForm.patchValue({
        name: { en: 'Cert Name', kh: '' },
        organization: { en: '', kh: 'ស្ថាប័ន' },
        issueDate: '2024-01-01',
      });
      component.onSubmit();

      expect(notificationServiceMock.showError).toHaveBeenCalledWith('English issuing organization is required.');
      expect(portfolioServiceMock.createAdminCertification).not.toHaveBeenCalled();
    });

    it('should create certification and navigate on valid form submit', () => {
      const navSpy = vi.spyOn(router, 'navigate');

      component.certForm.patchValue({
        name: { en: 'Kubernetes Administrator', kh: 'អ្នកគ្រប់គ្រង CKA' },
        organization: { en: 'CNCF', kh: 'CNCF' },
        type: 'certification',
        issueDate: '2024-05-01',
        credentialId: 'CKA-12345',
        credentialUrl: 'https://cncf.io/cert/12345',
      });

      component.onSubmit();

      expect(portfolioServiceMock.createAdminCertification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'certification',
          credentialId: 'CKA-12345',
        }),
      );
      expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Certification created successfully!');
      expect(navSpy).toHaveBeenCalledWith(['/admin/certifications']);
    });

    it('should handle error when createAdminCertification fails', () => {
      portfolioServiceMock.createAdminCertification.mockReturnValue(
        throwError(() => ({ error: { message: 'Database save failed' } })),
      );

      component.certForm.patchValue({
        name: { en: 'CKA', kh: '' },
        organization: { en: 'Linux Foundation', kh: '' },
        issueDate: '2024-01-01',
      });

      component.onSubmit();

      expect(component.isSubmitting()).toBe(false);
      expect(notificationServiceMock.showError).toHaveBeenCalledWith('Database save failed');
    });
  });

  describe('Edit Mode', () => {
    beforeEach(async () => {
      await createComponent('cert-123');
    });

    it('should initialize in edit mode and populate form from existing certification', () => {
      expect(component.isEditMode()).toBe(true);
      expect(component.certId()).toBe('cert-123');
      expect(portfolioServiceMock.getAdminCertificationById).toHaveBeenCalledWith('cert-123');

      expect(component.certForm.get('name')?.value).toEqual(mockCert.name);
      expect(component.certForm.get('organization')?.value).toEqual(mockCert.organization);
      expect(component.certForm.get('credentialId')?.value).toBe('GCP-PCA-999');
    });

    it('should update certification and navigate on submit in edit mode', () => {
      const navSpy = vi.spyOn(router, 'navigate');

      component.certForm.patchValue({
        credentialId: 'GCP-PCA-1000',
      });

      component.onSubmit();

      expect(portfolioServiceMock.updateAdminCertification).toHaveBeenCalledWith(
        'cert-123',
        expect.objectContaining({
          credentialId: 'GCP-PCA-1000',
        }),
      );
      expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Certification updated successfully!');
      expect(navSpy).toHaveBeenCalledWith(['/admin/certifications']);
    });

    it('should handle error when updateAdminCertification fails', () => {
      portfolioServiceMock.updateAdminCertification.mockReturnValue(
        throwError(() => ({ error: { message: 'Server update error' } })),
      );

      component.onSubmit();

      expect(component.isSubmitting()).toBe(false);
      expect(notificationServiceMock.showError).toHaveBeenCalledWith('Server update error');
    });
  });

  describe('Field Validation Helper', () => {
    beforeEach(async () => {
      await createComponent();
    });

    it('should return true for invalid touched controls', () => {
      const issueDateCtrl = component.certForm.get('issueDate');
      issueDateCtrl?.setValue('');
      issueDateCtrl?.markAsTouched();

      expect(component.isFieldInvalid('issueDate')).toBe(true);
    });

    it('should validate bilingual organization correctly', () => {
      const orgCtrl = component.certForm.get('organization');
      orgCtrl?.setValue({ en: '', kh: 'ខ្មែរ' });
      orgCtrl?.markAsTouched();

      expect(component.isFieldInvalid('organization')).toBe(true);

      orgCtrl?.setValue({ en: 'Microsoft', kh: 'ខ្មែរ' });
      expect(component.isFieldInvalid('organization')).toBe(false);
    });
  });
});
