import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BlogFormComponent } from './blog-form.component';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { BlogPost, Category } from '../../../../core/models';

describe('BlogFormComponent', () => {
  let component: BlogFormComponent;
  let fixture: ComponentFixture<BlogFormComponent>;
  let portfolioServiceMock: {
    getCategories: ReturnType<typeof vi.fn>;
    getAdminBlogPostById: ReturnType<typeof vi.fn>;
    createAdminBlogPost: ReturnType<typeof vi.fn>;
    updateAdminBlogPost: ReturnType<typeof vi.fn>;
  };
  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };
  let router: Router;

  const mockCategories: Category[] = [
    {
      _id: 'cat-1',
      name: { en: 'Web Development', kh: 'ការអភិវឌ្ឍគេហទំព័រ' },
      slug: 'web-dev',
      type: 'blog',
      order: 1,
    },
  ];

  const mockPost: BlogPost = {
    _id: 'post-1',
    title: { en: 'Angular Signals Deep Dive', kh: 'ស្វែងយល់ពី Angular Signals' },
    slug: 'angular-signals-deep-dive',
    excerpt: { en: 'A comprehensive guide to reactive primitives.', kh: 'សេចក្តីសង្ខេបអំពី reactive primitives' },
    content: { en: '# Angular Signals', kh: '# Angular Signals' },
    category: 'cat-1',
    tags: ['Angular', 'TypeScript'],
    status: 'published',
    featured: true,
    readingTime: 5,
    viewCount: 10,
    author: 'user-1',
    publishedAt: '2026-09-01T00:00:00.000Z',
    coverImage: 'https://images.unsplash.com/photo-1234',
  };

  const setupTestBed = async (routeParamId: string | null = null) => {
    portfolioServiceMock = {
      getCategories: vi.fn().mockReturnValue(of({ success: true, data: mockCategories })),
      getAdminBlogPostById: vi.fn().mockReturnValue(of({ success: true, data: mockPost })),
      createAdminBlogPost: vi.fn().mockReturnValue(of({ success: true, data: mockPost })),
      updateAdminBlogPost: vi.fn().mockReturnValue(of({ success: true, data: mockPost })),
    };

    notificationServiceMock = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [BlogFormComponent],
      providers: [
        provideRouter([]),
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? routeParamId : null),
              },
            },
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(BlogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('Create Mode', () => {
    beforeEach(async () => {
      await setupTestBed(null);
    });

    it('should create and initialize in create mode with empty form', () => {
      expect(component).toBeTruthy();
      expect(component.isEditMode()).toBe(false);
      expect(portfolioServiceMock.getCategories).toHaveBeenCalled();
      expect(portfolioServiceMock.getAdminBlogPostById).not.toHaveBeenCalled();
      expect(component.blogForm.get('status')?.value).toBe('draft');
      expect(component.blogForm.get('featured')?.value).toBe(false);
    });

    it('should auto-generate slug when English title changes in create mode', () => {
      component.blogForm.get('title')?.setValue({ en: 'Mastering RxJS Operators & Observables!', kh: '' });
      expect(component.blogForm.get('slug')?.value).toBe('mastering-rxjs-operators-observables');
    });

    it('should allow manually triggering auto-generate slug', () => {
      component.blogForm.get('title')?.setValue({ en: 'State Management 2026', kh: '' });
      component.autoGenerateSlug();
      expect(component.blogForm.get('slug')?.value).toBe('state-management-2026');
    });

    it('should add and remove tags properly', () => {
      component.newTagInput = 'TypeScript';
      component.addTag();
      expect(component.tagsList).toContain('TypeScript');
      expect(component.newTagInput).toBe('');

      // Avoid duplicates
      component.newTagInput = 'TypeScript';
      component.addTag();
      expect(component.tagsList.length).toBe(1);

      component.removeTag(0);
      expect(component.tagsList.length).toBe(0);
    });

    it('should handle cover image selection and removal', () => {
      const mockFile = new File(['dummy'], 'cover.png', { type: 'image/png' });
      component.onImageSelected(mockFile);
      expect(component.selectedCoverFile).toBe(mockFile);
      expect(component.blogForm.get('coverImage')?.value).toBe('file://cover.png');

      component.onImageRemoved();
      expect(component.selectedCoverFile).toBeNull();
      expect(component.blogForm.get('coverImage')?.value).toBe('');
    });

    it('should show error when required fields are missing on submit', () => {
      component.onSubmit();
      expect(notificationServiceMock.showError).toHaveBeenCalledWith('English article title is required.');
      expect(portfolioServiceMock.createAdminBlogPost).not.toHaveBeenCalled();
    });

    it('should submit valid form in create mode and navigate to /admin/blog', () => {
      component.blogForm.patchValue({
        title: { en: 'New Tech Post', kh: 'អត្ថបទបច្ចេកវិទ្យាថ្មី' },
        slug: 'new-tech-post',
        excerpt: { en: 'Summary of new tech post.', kh: 'សេចក្តីសង្ខេប' },
        content: { en: '# New Tech Post\n\nContent details here.', kh: '# មាតិកា' },
        category: 'cat-1',
        status: 'published',
        featured: true,
      });

      component.onSubmit();

      expect(portfolioServiceMock.createAdminBlogPost).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'new-tech-post',
          status: 'published',
          featured: true,
          category: 'cat-1',
        }),
      );
      expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Article created successfully!');
      expect(router.navigate).toHaveBeenCalledWith(['/admin/blog']);
    });
  });

  describe('Edit Mode', () => {
    beforeEach(async () => {
      await setupTestBed('post-1');
    });

    it('should initialize in edit mode and populate form from post data', () => {
      expect(component.isEditMode()).toBe(true);
      expect(component.blogId()).toBe('post-1');
      expect(portfolioServiceMock.getAdminBlogPostById).toHaveBeenCalledWith('post-1');
      expect(component.blogForm.get('title')?.value?.en).toBe('Angular Signals Deep Dive');
      expect(component.blogForm.get('slug')?.value).toBe('angular-signals-deep-dive');
      expect(component.blogForm.get('category')?.value).toBe('cat-1');
      expect(component.tagsList).toEqual(['Angular', 'TypeScript']);
    });

    it('should update article on submit in edit mode and navigate', () => {
      component.blogForm.patchValue({
        title: { en: 'Angular Signals Deep Dive (Updated)' },
      });

      component.onSubmit();

      expect(portfolioServiceMock.updateAdminBlogPost).toHaveBeenCalledWith(
        'post-1',
        expect.objectContaining({
          slug: 'angular-signals-deep-dive',
        }),
      );
      expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Article updated successfully!');
      expect(router.navigate).toHaveBeenCalledWith(['/admin/blog']);
    });

    it('should handle error when updating fails', () => {
      portfolioServiceMock.updateAdminBlogPost.mockReturnValue(
        throwError(() => ({ error: { message: 'Database error' } })),
      );

      component.onSubmit();

      expect(component.isSubmitting()).toBe(false);
      expect(notificationServiceMock.showError).toHaveBeenCalledWith('Database error');
    });
  });
});
