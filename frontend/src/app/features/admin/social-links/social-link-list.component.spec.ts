import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { SocialLinkListComponent } from './social-link-list.component';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SocialLink } from '../../../core/models';

describe('SocialLinkListComponent', () => {
  let component: SocialLinkListComponent;
  let fixture: ComponentFixture<SocialLinkListComponent>;
  let portfolioServiceMock: {
    getAdminSocialLinks: ReturnType<typeof vi.fn>;
    createAdminSocialLink: ReturnType<typeof vi.fn>;
    updateAdminSocialLink: ReturnType<typeof vi.fn>;
    deleteAdminSocialLink: ReturnType<typeof vi.fn>;
  };
  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };
  let dialogMock: {
    open: ReturnType<typeof vi.fn>;
  };

  const mockLinks: SocialLink[] = [
    {
      _id: 'link-1',
      platform: 'github',
      label: 'GitHub Profile',
      url: 'https://github.com/dimsareach',
      icon: 'github',
      order: 1,
      isVisible: true,
      createdAt: '2026-09-01T00:00:00Z',
      updatedAt: '2026-09-01T00:00:00Z',
    },
    {
      _id: 'link-2',
      platform: 'linkedin',
      label: 'LinkedIn',
      url: 'https://linkedin.com/in/dimsareach',
      icon: 'linkedin',
      order: 2,
      isVisible: false,
      createdAt: '2026-09-01T00:00:00Z',
      updatedAt: '2026-09-01T00:00:00Z',
    },
  ];

  beforeEach(async () => {
    portfolioServiceMock = {
      getAdminSocialLinks: vi.fn().mockReturnValue(of({ success: true, data: mockLinks })),
      createAdminSocialLink: vi.fn().mockReturnValue(of({ success: true, data: mockLinks[0] })),
      updateAdminSocialLink: vi.fn().mockReturnValue(of({ success: true, data: mockLinks[0] })),
      deleteAdminSocialLink: vi.fn().mockReturnValue(of({ success: true, data: null })),
    };

    notificationServiceMock = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    dialogMock = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [SocialLinkListComponent],
      providers: [
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialLinkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load social links on init', () => {
    expect(component).toBeTruthy();
    expect(portfolioServiceMock.getAdminSocialLinks).toHaveBeenCalled();
    expect(component.socialLinks().length).toBe(2);
    expect(component.isLoading()).toBe(false);
  });

  it('should toggle link visibility', () => {
    const link = mockLinks[0];
    component.toggleVisibility(link);
    expect(portfolioServiceMock.updateAdminSocialLink).toHaveBeenCalledWith('link-1', { isVisible: false });
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Link marked as hidden.');
  });

  it('should create a new link through modal', () => {
    component.openCreateModal();
    expect(component.showModal()).toBe(true);

    component.linkForm.patchValue({
      platform: 'twitter',
      label: 'Twitter / X',
      url: 'https://x.com/dimsareach',
    });

    component.saveLink();
    expect(portfolioServiceMock.createAdminSocialLink).toHaveBeenCalled();
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Social link created successfully!');
    expect(component.showModal()).toBe(false);
  });

  it('should update an existing link through modal', () => {
    component.openEditModal(mockLinks[0]);
    expect(component.editingLinkId).toBe('link-1');

    component.linkForm.patchValue({
      label: 'GitHub Sareach',
    });

    component.saveLink();
    expect(portfolioServiceMock.updateAdminSocialLink).toHaveBeenCalledWith(
      'link-1',
      expect.objectContaining({ label: 'GitHub Sareach' }),
    );
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Social link updated successfully!');
  });

  it('should delete a link on confirmation', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(true),
    });

    component.onDelete(mockLinks[0]);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(portfolioServiceMock.deleteAdminSocialLink).toHaveBeenCalledWith('link-1');
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Social link deleted successfully.');
  });

  it('should support Telegram platform in edit and create modal', () => {
    const telegramOption = component.platformOptions.find((p) => p.value === 'telegram');
    expect(telegramOption).toBeDefined();
    expect(telegramOption?.label).toBe('Telegram');

    const telegramLink: SocialLink = {
      _id: 'link-tg',
      platform: 'telegram',
      label: 'Telegram',
      url: 'https://t.me/sareach_dim',
      icon: 'telegram',
      order: 3,
      isVisible: true,
    };

    component.openEditModal(telegramLink);
    expect(component.editingLinkId).toBe('link-tg');
    expect(component.linkForm.get('platform')?.value).toBe('telegram');
    expect(component.linkForm.valid).toBe(true);

    component.saveLink();
    expect(portfolioServiceMock.updateAdminSocialLink).toHaveBeenCalledWith(
      'link-tg',
      expect.objectContaining({
        platform: 'telegram',
        label: 'Telegram',
        url: 'https://t.me/sareach_dim',
      }),
    );
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Social link updated successfully!');
  });

  it('should handle error when loading fails', () => {
    portfolioServiceMock.getAdminSocialLinks.mockReturnValue(throwError(() => new Error('Error')));
    component.loadSocialLinks();
    expect(notificationServiceMock.showError).toHaveBeenCalledWith('Failed to load social links.');
  });

  it('should trigger openEditModal when clicking edit action button in table', () => {
    const editSpy = vi.spyOn(component, 'openEditModal');
    const editBtns = fixture.nativeElement.querySelectorAll('button[aria-label="Edit link"]');
    expect(editBtns.length).toBe(2);
    editBtns[0].click();
    expect(editSpy).toHaveBeenCalledWith(mockLinks[0]);
    expect(component.showModal()).toBe(true);
  });

  it('should trigger onDelete when clicking delete action button in table', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(false),
    });
    const deleteSpy = vi.spyOn(component, 'onDelete');
    const deleteBtns = fixture.nativeElement.querySelectorAll('button[aria-label="Delete link"]');
    expect(deleteBtns.length).toBe(2);
    deleteBtns[0].click();
    expect(deleteSpy).toHaveBeenCalledWith(mockLinks[0]);
  });
});
