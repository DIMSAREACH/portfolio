import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BlogListComponent } from './blog-list.component';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { BlogPost, Category } from '../../../../core/models';

describe('BlogListComponent', () => {
  let component: BlogListComponent;
  let fixture: ComponentFixture<BlogListComponent>;
  let portfolioServiceMock: {
    getCategories: ReturnType<typeof vi.fn>;
    getAdminBlogPosts: ReturnType<typeof vi.fn>;
    publishAdminBlogPost: ReturnType<typeof vi.fn>;
    unpublishAdminBlogPost: ReturnType<typeof vi.fn>;
    deleteAdminBlogPost: ReturnType<typeof vi.fn>;
  };
  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };
  let router: Router;
  let dialogMock: {
    open: ReturnType<typeof vi.fn>;
  };

  const mockCategories: Category[] = [
    {
      _id: 'cat-1',
      name: { en: 'Web Development', kh: 'ការអភិវឌ្ឍគេហទំព័រ' },
      slug: 'web-dev',
      type: 'blog',
      order: 1,
    },
  ];

  const mockPosts: BlogPost[] = [
    {
      _id: 'post-1',
      title: { en: 'Angular Signals Deep Dive', kh: 'ស្វែងយល់ពី Angular Signals' },
      slug: 'angular-signals-deep-dive',
      excerpt: { en: 'A comprehensive guide to reactive primitives.', kh: 'សេចក្តីសង្ខេបអំពី reactive primitives' },
      content: { en: '# Angular Signals', kh: '# Angular Signals' },
      category: mockCategories[0],
      tags: ['Angular', 'TypeScript', 'Signals'],
      status: 'published',
      featured: true,
      readingTime: 6,
      viewCount: 142,
      author: 'user-1',
      publishedAt: '2026-09-01T00:00:00.000Z',
      createdAt: '2026-08-30T00:00:00.000Z',
    },
    {
      _id: 'post-2',
      title: { en: 'Docker Best Practices', kh: 'ការអនុវត្តល្អបំផុតសម្រាប់ Docker' },
      slug: 'docker-best-practices',
      excerpt: { en: 'Optimizing container images.', kh: 'ការបង្កើនប្រសិទ្ធភាព container' },
      content: { en: '# Docker Guide', kh: '# ការណែនាំអំពី Docker' },
      category: 'cat-1',
      tags: ['Docker', 'DevOps'],
      status: 'draft',
      featured: false,
      readingTime: 4,
      viewCount: 0,
      author: 'user-1',
      createdAt: '2026-09-10T00:00:00.000Z',
    },
  ];

  beforeEach(async () => {
    portfolioServiceMock = {
      getCategories: vi.fn().mockReturnValue(of({ success: true, data: mockCategories })),
      getAdminBlogPosts: vi.fn().mockReturnValue(
        of({
          success: true,
          data: {
            items: mockPosts,
            pagination: { total: 2, page: 1, limit: 10, totalPages: 1 },
          },
        }),
      ),
      publishAdminBlogPost: vi.fn().mockReturnValue(of({ success: true, data: { ...mockPosts[1], status: 'published' } })),
      unpublishAdminBlogPost: vi.fn().mockReturnValue(of({ success: true, data: { ...mockPosts[0], status: 'draft' } })),
      deleteAdminBlogPost: vi.fn().mockReturnValue(of({ success: true, data: null })),
    };

    notificationServiceMock = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    dialogMock = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [BlogListComponent],
      providers: [
        provideRouter([]),
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(BlogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load blog posts & categories on init', () => {
    expect(component).toBeTruthy();
    expect(portfolioServiceMock.getCategories).toHaveBeenCalled();
    expect(portfolioServiceMock.getAdminBlogPosts).toHaveBeenCalled();
    expect(component.blogPosts().length).toBe(2);
    expect(component.totalItems()).toBe(2);
    expect(component.isLoading()).toBe(false);
  });

  it('should handle search term change and reset page to 1', () => {
    component.onSearchChange('signals');
    expect(component.searchTerm()).toBe('signals');
    expect(component.currentPage()).toBe(1);
    expect(portfolioServiceMock.getAdminBlogPosts).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'signals', page: 1 }),
    );
  });

  it('should handle status filter change', () => {
    component.onFilterChange('published');
    expect(component.activeFilter()).toBe('published');
    expect(component.currentPage()).toBe(1);
    expect(portfolioServiceMock.getAdminBlogPosts).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'published', page: 1 }),
    );
  });

  it('should filter by category when category button clicked', () => {
    component.onCategorySelect('cat-1');
    expect(component.selectedCategory()).toBe('cat-1');
    expect(component.currentPage()).toBe(1);
    expect(portfolioServiceMock.getAdminBlogPosts).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'cat-1', page: 1 }),
    );
  });

  it('should navigate to create page on onCreateClick', () => {
    component.onCreateClick();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/blog/create']);
  });

  it('should navigate to edit page on onEditClick', () => {
    component.onEditClick({ _id: 'post-1' });
    expect(router.navigate).toHaveBeenCalledWith(['/admin/blog', 'post-1', 'edit']);
  });

  it('should navigate to public article page on onViewClick', () => {
    component.onViewClick({ slug: 'angular-signals-deep-dive' });
    expect(router.navigate).toHaveBeenCalledWith(['/blog', 'angular-signals-deep-dive']);
  });

  it('should quick publish a draft blog post', () => {
    const draftPost = mockPosts[1];
    component.onTogglePublishClick(draftPost as unknown as Record<string, unknown>);

    expect(portfolioServiceMock.publishAdminBlogPost).toHaveBeenCalledWith('post-2');
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Post published successfully.');
  });

  it('should quick unpublish a published blog post', () => {
    const publishedPost = mockPosts[0];
    component.onTogglePublishClick(publishedPost as unknown as Record<string, unknown>);

    expect(portfolioServiceMock.unpublishAdminBlogPost).toHaveBeenCalledWith('post-1');
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Post unpublished and set to draft.');
  });

  it('should open delete confirmation dialog and delete upon confirmation', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(true),
    });

    component.onDeleteClick(mockPosts[0] as unknown as Record<string, unknown>);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(portfolioServiceMock.deleteAdminBlogPost).toHaveBeenCalledWith('post-1');
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Blog post deleted successfully.');
  });

  it('should not delete if dialog was cancelled', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(false),
    });

    component.onDeleteClick(mockPosts[0] as unknown as Record<string, unknown>);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(portfolioServiceMock.deleteAdminBlogPost).not.toHaveBeenCalled();
  });

  it('should show error notification when loading fails', () => {
    portfolioServiceMock.getAdminBlogPosts.mockReturnValue(throwError(() => new Error('Error')));
    component.loadBlogPosts();
    expect(notificationServiceMock.showError).toHaveBeenCalledWith('Failed to load blog posts.');
  });
});
