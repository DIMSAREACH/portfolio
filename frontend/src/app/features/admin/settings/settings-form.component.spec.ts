import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { SettingsFormComponent } from './settings-form.component';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Settings } from '../../../core/models';

describe('SettingsFormComponent', () => {
  let component: SettingsFormComponent;
  let fixture: ComponentFixture<SettingsFormComponent>;
  let portfolioServiceMock: {
    getAdminSettings: ReturnType<typeof vi.fn>;
    updateAdminSettings: ReturnType<typeof vi.fn>;
  };
  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };

  const mockSettings: Settings = {
    _id: 'settings-1',
    siteTitle: { en: 'Sareach Dim | Portfolio', kh: 'ឌីម សារាជ | គេហទំព័រ' },
    siteDescription: { en: 'Cloud architect portfolio', kh: 'គេហទំព័រផ្ទាល់ខ្លួន' },
    enableCvDownload: true,
    enableContactForm: true,
    emailNotifications: true,
    notificationEmail: 'alert@example.com',
    maintenanceMode: false,
    cvDownloadCount: 0,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  };

  beforeEach(async () => {
    portfolioServiceMock = {
      getAdminSettings: vi.fn().mockReturnValue(of({ success: true, data: mockSettings })),
      updateAdminSettings: vi.fn().mockReturnValue(of({ success: true, data: mockSettings })),
    };

    notificationServiceMock = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SettingsFormComponent],
      providers: [
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load settings on initialization', () => {
    expect(component).toBeTruthy();
    expect(portfolioServiceMock.getAdminSettings).toHaveBeenCalled();
    expect(component.settingsForm.get('siteTitle')?.value?.en).toBe('Sareach Dim | Portfolio');
    expect(component.settingsForm.get('enableCvDownload')?.value).toBe(true);
    expect(component.settingsForm.get('notificationEmail')?.value).toBe('alert@example.com');
  });

  it('should show error notification when loading settings fails', () => {
    portfolioServiceMock.getAdminSettings.mockReturnValue(throwError(() => new Error('Load failed')));
    component.loadSettings();
    expect(notificationServiceMock.showError).toHaveBeenCalledWith('Failed to load system settings.');
  });

  it('should prevent submission when form is invalid', () => {
    component.settingsForm.patchValue({
      siteTitle: { en: '', kh: '' },
      notificationEmail: 'invalid-email-format',
    });
    component.onSubmit();

    expect(notificationServiceMock.showError).toHaveBeenCalledWith('Please check form fields for errors.');
    expect(portfolioServiceMock.updateAdminSettings).not.toHaveBeenCalled();
  });

  it('should update settings successfully and show success alert', () => {
    component.onSubmit();

    expect(portfolioServiceMock.updateAdminSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        enableCvDownload: true,
        enableContactForm: true,
        emailNotifications: true,
        notificationEmail: 'alert@example.com',
        maintenanceMode: false,
      }),
    );
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Settings updated successfully!');
    expect(component.isSaving()).toBe(false);
  });

  it('should handle error when updating settings fails', () => {
    portfolioServiceMock.updateAdminSettings.mockReturnValue(
      throwError(() => ({ error: { message: 'Server error saving settings' } })),
    );

    component.onSubmit();

    expect(component.isSaving()).toBe(false);
    expect(notificationServiceMock.showError).toHaveBeenCalledWith('Server error saving settings');
  });
});
