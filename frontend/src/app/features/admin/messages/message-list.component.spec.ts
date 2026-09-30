import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MessageListComponent } from './message-list.component';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Message } from '../../../core/models';

describe('MessageListComponent', () => {
  let component: MessageListComponent;
  let fixture: ComponentFixture<MessageListComponent>;
  let portfolioServiceMock: {
    getAdminMessages: ReturnType<typeof vi.fn>;
    markAdminMessageAsRead: ReturnType<typeof vi.fn>;
    markAdminMessageAsUnread: ReturnType<typeof vi.fn>;
    deleteAdminMessage: ReturnType<typeof vi.fn>;
  };
  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };
  let dialogMock: {
    open: ReturnType<typeof vi.fn>;
  };

  const getMockMessages = (): Message[] => [
    {
      _id: 'msg-1',
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Consulting Project Proposal',
      message: 'Hello, we would love to hire you for our Next.js frontend rebuild.',
      isRead: false,
      isArchived: false,
      createdAt: '2026-09-15T00:00:00Z',
      updatedAt: '2026-09-15T00:00:00Z',
    },
    {
      _id: 'msg-2',
      name: 'Jane Smith',
      email: 'jane@acme.corp',
      subject: 'Interview Invitation',
      message: 'Are you available for a remote architecture call this Thursday?',
      isRead: true,
      isArchived: false,
      createdAt: '2026-09-10T00:00:00Z',
      updatedAt: '2026-09-10T00:00:00Z',
    },
  ];

  let mockMessages: Message[];

  beforeEach(async () => {
    mockMessages = getMockMessages();
    portfolioServiceMock = {
      getAdminMessages: vi.fn().mockReturnValue(
        of({
          success: true,
          data: {
            items: mockMessages,
            pagination: { total: 2, page: 1, limit: 10, totalPages: 1 },
          },
        }),
      ),
      markAdminMessageAsRead: vi.fn().mockReturnValue(of({ success: true, data: { ...mockMessages[0], isRead: true } })),
      markAdminMessageAsUnread: vi.fn().mockReturnValue(of({ success: true, data: { ...mockMessages[1], isRead: false } })),
      deleteAdminMessage: vi.fn().mockReturnValue(of({ success: true, data: null })),
    };

    notificationServiceMock = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    dialogMock = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [MessageListComponent],
      providers: [
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load messages with unread count', () => {
    expect(component).toBeTruthy();
    expect(portfolioServiceMock.getAdminMessages).toHaveBeenCalled();
    expect(component.messages().length).toBe(2);
    expect(component.unreadCount()).toBe(1);
    expect(component.isLoading()).toBe(false);
  });

  it('should filter messages by read/unread', () => {
    component.onFilterChange('unread');
    expect(component.activeFilter()).toBe('unread');
    expect(portfolioServiceMock.getAdminMessages).toHaveBeenCalledWith(
      expect.objectContaining({ isRead: false }),
    );
  });

  it('should open detail and mark unread message as read', () => {
    component.openDetail(mockMessages[0]);
    expect(component.selectedMessage()).toEqual(mockMessages[0]);
    expect(portfolioServiceMock.markAdminMessageAsRead).toHaveBeenCalledWith('msg-1');
  });

  it('should toggle read status of message', () => {
    const unread = mockMessages[0];
    component.toggleReadStatus(unread);
    expect(portfolioServiceMock.markAdminMessageAsRead).toHaveBeenCalledWith('msg-1');
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Marked as read.');

    const read = mockMessages[1];
    component.toggleReadStatus(read);
    expect(portfolioServiceMock.markAdminMessageAsUnread).toHaveBeenCalledWith('msg-2');
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Marked as unread.');
  });

  it('should delete message on confirmation', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(true),
    });

    component.onDelete(mockMessages[0]);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(portfolioServiceMock.deleteAdminMessage).toHaveBeenCalledWith('msg-1');
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Message deleted successfully.');
  });

  it('should handle error when loading messages fails', () => {
    portfolioServiceMock.getAdminMessages.mockReturnValue(throwError(() => new Error('Error')));
    component.loadMessages();
    expect(notificationServiceMock.showError).toHaveBeenCalledWith('Failed to load inquiries.');
  });
});
