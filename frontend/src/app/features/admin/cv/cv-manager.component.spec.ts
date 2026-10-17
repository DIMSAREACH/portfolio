import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CvManagerComponent } from './cv-manager.component';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { NotificationService } from '../../../core/services/notification.service';

describe('CvManagerComponent', () => {
  let component: CvManagerComponent;
  let fixture: ComponentFixture<CvManagerComponent>;
  let portfolioServiceMock: {
    getAdminCv: ReturnType<typeof vi.fn>;
    uploadAdminCv: ReturnType<typeof vi.fn>;
    deleteAdminCv: ReturnType<typeof vi.fn>;
    getCvDownloadUrl: ReturnType<typeof vi.fn>;
    getCvPreviewUrl: ReturnType<typeof vi.fn>;
  };
  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };
  let dialogMock: {
    open: ReturnType<typeof vi.fn>;
  };

  const mockCvData = {
    cvUrl: 'https://cloudinary.com/resume.pdf',
    cvPublicId: 'resume_123',
    fileName: 'resume.pdf',
    updatedAt: '2026-09-01T00:00:00Z',
  };

  beforeEach(async () => {
    portfolioServiceMock = {
      getAdminCv: vi.fn().mockReturnValue(of({ success: true, data: mockCvData })),
      uploadAdminCv: vi.fn().mockReturnValue(of({ success: true, data: { cvUrl: 'https://cloudinary.com/new.pdf' } })),
      deleteAdminCv: vi.fn().mockReturnValue(of({ success: true, data: null })),
      getCvDownloadUrl: vi.fn().mockReturnValue('http://localhost:5000/api/v1/cv/download'),
      getCvPreviewUrl: vi.fn().mockReturnValue('http://localhost:5000/api/v1/cv/preview'),
    };

    notificationServiceMock = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    dialogMock = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CvManagerComponent],
      providers: [
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CvManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load CV on init', () => {
    expect(component).toBeTruthy();
    expect(portfolioServiceMock.getAdminCv).toHaveBeenCalled();
    expect(component.currentCv()?.cvUrl).toBe('https://cloudinary.com/resume.pdf');
    expect(component.isLoading()).toBe(false);
  });

  it('should reject non-PDF uploads', () => {
    const file = new File(['dummy'], 'pic.png', { type: 'image/png' });
    const event = {
      target: {
        files: [file],
        value: 'pic.png',
      },
    } as unknown as Event;

    component.onFileSelected(event);
    expect(notificationServiceMock.showError).toHaveBeenCalledWith('Only PDF files are supported.');
    expect(portfolioServiceMock.uploadAdminCv).not.toHaveBeenCalled();
  });

  it('should upload valid PDF file', () => {
    const file = new File(['dummy pdf'], 'resume.pdf', { type: 'application/pdf' });
    const event = {
      target: {
        files: [file],
        value: 'resume.pdf',
      },
    } as unknown as Event;

    component.onFileSelected(event);
    expect(portfolioServiceMock.uploadAdminCv).toHaveBeenCalled();
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('CV uploaded and activated successfully!');
  });

  it('should delete active CV upon confirmation', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(true),
    });

    component.onDeleteCv();
    expect(dialogMock.open).toHaveBeenCalled();
    expect(portfolioServiceMock.deleteAdminCv).toHaveBeenCalled();
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Active CV deleted successfully.');
  });

  it('should handle error when loading CV fails', () => {
    portfolioServiceMock.getAdminCv.mockReturnValue(throwError(() => new Error('Error')));
    component.loadCv();
    expect(notificationServiceMock.showError).toHaveBeenCalledWith('Failed to load CV information.');
  });

  it('should create blob URL and prevent default when previewing base64 CV', () => {
    const dummyBase64Pdf = 'data:application/pdf;base64,JVBERi0xLjQKJWR1bW15';
    component.currentCv.set({
      cvUrl: dummyBase64Pdf,
      fileName: 'test.pdf',
    });

    const preventDefaultSpy = vi.fn();
    const event = {
      preventDefault: preventDefaultSpy,
    } as unknown as MouseEvent;

    const originalCreateObjectURL = URL.createObjectURL;
    const originalOpen = window.open;
    const createObjectURLSpy = vi.fn().mockReturnValue('blob:http://localhost:4200/dummy-uuid');
    const openSpy = vi.fn();
    URL.createObjectURL = createObjectURLSpy;
    window.open = openSpy;

    try {
      component.onPreviewCv(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(openSpy).toHaveBeenCalledWith('blob:http://localhost:4200/dummy-uuid', '_blank');
    } finally {
      URL.createObjectURL = originalCreateObjectURL;
      window.open = originalOpen;
    }
  });

  it('should not prevent default when previewing remote http CV URL', () => {
    component.currentCv.set({
      cvUrl: 'https://cloudinary.com/test.pdf',
      fileName: 'test.pdf',
    });

    const preventDefaultSpy = vi.fn();
    const event = {
      preventDefault: preventDefaultSpy,
    } as unknown as MouseEvent;

    component.onPreviewCv(event);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });
});

