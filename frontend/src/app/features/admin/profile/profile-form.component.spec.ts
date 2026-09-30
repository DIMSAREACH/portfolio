import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ProfileFormComponent } from './profile-form.component';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Profile } from '../../../core/models';

describe('ProfileFormComponent', () => {
  let component: ProfileFormComponent;
  let fixture: ComponentFixture<ProfileFormComponent>;
  let portfolioServiceMock: {
    getAdminProfile: ReturnType<typeof vi.fn>;
    upsertAdminProfile: ReturnType<typeof vi.fn>;
  };
  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };

  const mockProfile: Profile = {
    _id: 'prof-1',
    fullName: { en: 'Sareach Dim', kh: 'ឌីម សារាជ' },
    title: { en: 'Senior Full-Stack Cloud Engineer', kh: 'វិស្វករ Cloud' },
    introduction: { en: 'Passionate software architect', kh: 'វិស្វករផ្នែកទន់' },
    about: { en: '# Story', kh: '# រឿងរ៉ាវ' },
    email: 'developer@example.com',
    phone: '+855 12 345 678',
    location: { en: 'Phnom Penh, Cambodia', kh: 'ភ្នំពេញ' },
    profileImage: 'https://example.com/avatar.jpg',
    aboutImage: 'https://example.com/about.jpg',
    professionalSummary: { en: 'Summary...', kh: '' },
    careerInterests: { en: 'Cloud, Distributed Systems', kh: '' },
    background: { en: 'CS Degree', kh: '' },
    goals: { en: 'Open source impact', kh: '' },
    strengths: { en: ['Architecture'], kh: [] },
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  };

  beforeEach(async () => {
    portfolioServiceMock = {
      getAdminProfile: vi.fn().mockReturnValue(of({ success: true, data: mockProfile })),
      upsertAdminProfile: vi.fn().mockReturnValue(of({ success: true, data: mockProfile })),
    };

    notificationServiceMock = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProfileFormComponent],
      providers: [
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load profile on init', () => {
    expect(component).toBeTruthy();
    expect(portfolioServiceMock.getAdminProfile).toHaveBeenCalled();
    expect(component.profileForm.get('fullName')?.value?.en).toBe('Sareach Dim');
    expect(component.profileForm.get('title')?.value?.en).toBe('Senior Full-Stack Cloud Engineer');
    expect(component.profileForm.get('email')?.value).toBe('developer@example.com');
  });

  it('should handle profile and about image selection and removal', () => {
    const file = new File(['dummy'], 'pic.jpg', { type: 'image/jpeg' });
    component.onProfileImageSelected(file);
    expect(component.selectedProfileFile).toBe(file);
    expect(component.profileForm.get('profileImage')?.value).toBe('file://pic.jpg');

    component.onProfileImageRemoved();
    expect(component.selectedProfileFile).toBeNull();
    expect(component.profileForm.get('profileImage')?.value).toBe('');

    component.onAboutImageSelected(file);
    expect(component.selectedAboutFile).toBe(file);
    component.onAboutImageRemoved();
    expect(component.selectedAboutFile).toBeNull();
  });

  it('should show error when required fullName is missing on submit', () => {
    component.profileForm.patchValue({ fullName: { en: '', kh: '' } });
    component.onSubmit();
    expect(notificationServiceMock.showError).toHaveBeenCalledWith('English full name is required.');
    expect(portfolioServiceMock.upsertAdminProfile).not.toHaveBeenCalled();
  });

  it('should submit valid profile and show success notification', () => {
    component.onSubmit();

    expect(portfolioServiceMock.upsertAdminProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'developer@example.com',
        phone: '+855 12 345 678',
      }),
    );
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Profile updated successfully!');
    expect(component.isSubmitting()).toBe(false);
  });

  it('should handle error when upsert fails', () => {
    portfolioServiceMock.upsertAdminProfile.mockReturnValue(
      throwError(() => ({ error: { message: 'Failed to update' } })),
    );

    component.onSubmit();
    expect(component.isSubmitting()).toBe(false);
    expect(notificationServiceMock.showError).toHaveBeenCalledWith('Failed to update');
  });
});
