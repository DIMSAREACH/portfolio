import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MediaListComponent } from './media-list.component';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Media } from '../../../core/models';

describe('MediaListComponent', () => {
  let component: MediaListComponent;
  let fixture: ComponentFixture<MediaListComponent>;
  let portfolioServiceMock: {
    getAdminMedia: ReturnType<typeof vi.fn>;
    uploadAdminMedia: ReturnType<typeof vi.fn>;
    deleteAdminMedia: ReturnType<typeof vi.fn>;
  };
  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };
  let dialogMock: {
    open: ReturnType<typeof vi.fn>;
  };

  const mockMedia: Media[] = [
    {
      _id: 'media-1',
      fileName: 'architecture-diagram.png',
      url: 'https://cloudinary.com/diagram.png',
      publicId: 'diagram_123',
      mimeType: 'image/png',
      size: 1048576, // 1MB
      createdAt: '2026-09-01T00:00:00Z',
      updatedAt: '2026-09-01T00:00:00Z',
    },
  ];

  beforeEach(async () => {
    portfolioServiceMock = {
      getAdminMedia: vi.fn().mockReturnValue(
        of({
          success: true,
          data: {
            items: mockMedia,
            pagination: { total: 1, page: 1, limit: 12, totalPages: 1 },
          },
        }),
      ),
      uploadAdminMedia: vi.fn().mockReturnValue(of({ success: true, data: mockMedia[0] })),
      deleteAdminMedia: vi.fn().mockReturnValue(of({ success: true, data: null })),
    };

    notificationServiceMock = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    dialogMock = {
      open: vi.fn(),
    };

    // Mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    await TestBed.configureTestingModule({
      imports: [MediaListComponent],
      providers: [
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load media items on init', () => {
    expect(component).toBeTruthy();
    expect(portfolioServiceMock.getAdminMedia).toHaveBeenCalled();
    expect(component.mediaItems().length).toBe(1);
    expect(component.isLoading()).toBe(false);
  });

  it('should format bytes correctly', () => {
    expect(component.formatBytes(0)).toBe('0 B');
    expect(component.formatBytes(1048576)).toBe('1 MB');
    expect(component.formatBytes(512000)).toBe('500 KB');
  });

  it('should copy URL to clipboard', async () => {
    component.copyUrl('https://example.com/img.png');
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://example.com/img.png');
  });

  it('should upload a selected file', () => {
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    const event = {
      target: {
        files: [file],
        value: 'test.png',
      },
    } as unknown as Event;

    component.onFileSelected(event);
    expect(portfolioServiceMock.uploadAdminMedia).toHaveBeenCalled();
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Image uploaded to library successfully!');
  });

  it('should delete a media item on confirmation', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(true),
    });

    component.onDelete(mockMedia[0]);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(portfolioServiceMock.deleteAdminMedia).toHaveBeenCalledWith('media-1');
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Media asset deleted.');
  });

  it('should handle error when loading fails', () => {
    portfolioServiceMock.getAdminMedia.mockReturnValue(throwError(() => new Error('Error')));
    component.loadMedia();
    expect(notificationServiceMock.showError).toHaveBeenCalledWith('Failed to load media assets.');
  });

  it('should filter media items by file type', () => {
    component.setFilter('image');
    expect(component.activeMimeType()).toBe('image');
    expect(portfolioServiceMock.getAdminMedia).toHaveBeenCalledWith({ mimeType: 'image' });

    component.setFilter('');
    expect(component.activeMimeType()).toBe('');
    expect(portfolioServiceMock.getAdminMedia).toHaveBeenCalledWith({});
  });
});
