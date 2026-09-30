import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { CategoryListComponent } from './category-list.component';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Category } from '../../../core/models';

describe('CategoryListComponent', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
  let portfolioServiceMock: {
    getAdminCategories: ReturnType<typeof vi.fn>;
    createAdminCategory: ReturnType<typeof vi.fn>;
    updateAdminCategory: ReturnType<typeof vi.fn>;
    deleteAdminCategory: ReturnType<typeof vi.fn>;
  };
  let notificationServiceMock: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };
  let dialogMock: {
    open: ReturnType<typeof vi.fn>;
  };

  const mockCategories: Category[] = [
    {
      _id: 'cat-1',
      name: { en: 'Web Development', kh: 'ការអភិវឌ្ឍគេហទំព័រ' },
      slug: 'web-development',
      type: 'project',
      description: { en: 'Full stack web apps', kh: 'កម្មវិធីគេហទំព័រ' },
      order: 1,
    },
    {
      _id: 'cat-2',
      name: { en: 'DevOps & Cloud', kh: 'ពពក' },
      slug: 'devops-cloud',
      type: 'blog',
      description: { en: 'CI/CD and Kubernetes', kh: '' },
      order: 2,
    },
  ];

  beforeEach(async () => {
    portfolioServiceMock = {
      getAdminCategories: vi.fn().mockReturnValue(of({ success: true, data: mockCategories })),
      createAdminCategory: vi.fn().mockReturnValue(of({ success: true, data: mockCategories[0] })),
      updateAdminCategory: vi.fn().mockReturnValue(of({ success: true, data: mockCategories[0] })),
      deleteAdminCategory: vi.fn().mockReturnValue(of({ success: true, data: null })),
    };

    notificationServiceMock = {
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };

    dialogMock = {
      open: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CategoryListComponent],
      providers: [
        { provide: PortfolioService, useValue: portfolioServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: MatDialog, useValue: dialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load categories on init', () => {
    expect(component).toBeTruthy();
    expect(portfolioServiceMock.getAdminCategories).toHaveBeenCalled();
    expect(component.categories().length).toBe(2);
    expect(component.isLoading()).toBe(false);
  });

  it('should filter categories by type and search query', () => {
    component.typeFilter.set('project');
    expect(component.filteredCategories().length).toBe(1);
    expect(component.filteredCategories()[0].slug).toBe('web-development');

    component.typeFilter.set('all');
    component.searchQuery = 'DevOps';
    expect(component.filteredCategories().length).toBe(1);
    expect(component.filteredCategories()[0].slug).toBe('devops-cloud');
  });

  it('should open modal for creating a new category', () => {
    component.openCreateModal();
    expect(component.showModal()).toBe(true);
    expect(component.editingCategoryId).toBeNull();
    expect(component.categoryForm.get('type')?.value).toBe('project');
  });

  it('should open modal for editing category', () => {
    component.openEditModal(mockCategories[0]);
    expect(component.showModal()).toBe(true);
    expect(component.editingCategoryId).toBe('cat-1');
    expect(component.categoryForm.get('slug')?.value).toBe('web-development');
  });

  it('should save category in create mode', () => {
    component.openCreateModal();
    component.categoryForm.patchValue({
      name: { en: 'Mobile Apps', kh: 'កម្មវិធីទូរស័ព្ទ' },
      slug: 'mobile-apps',
      type: 'both',
    });

    component.saveCategory();

    expect(portfolioServiceMock.createAdminCategory).toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'mobile-apps', type: 'both' }),
    );
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Category created successfully!');
    expect(component.showModal()).toBe(false);
  });

  it('should update category in edit mode', () => {
    component.openEditModal(mockCategories[0]);
    component.categoryForm.patchValue({
      name: { en: 'Web Development (Updated)', kh: 'ការអភិវឌ្ឍគេហទំព័រ' },
    });

    component.saveCategory();

    expect(portfolioServiceMock.updateAdminCategory).toHaveBeenCalledWith(
      'cat-1',
      expect.objectContaining({ slug: 'web-development' }),
    );
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Category updated successfully!');
    expect(component.showModal()).toBe(false);
  });

  it('should delete category upon dialog confirmation', () => {
    dialogMock.open.mockReturnValue({
      afterClosed: () => of(true),
    });

    component.onDeleteCategory(mockCategories[0]);

    expect(dialogMock.open).toHaveBeenCalled();
    expect(portfolioServiceMock.deleteAdminCategory).toHaveBeenCalledWith('cat-1');
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith('Category deleted successfully.');
  });

  it('should handle error when loading categories fails', () => {
    portfolioServiceMock.getAdminCategories.mockReturnValue(throwError(() => new Error('API error')));
    component.loadCategories();
    expect(notificationServiceMock.showError).toHaveBeenCalledWith('Failed to load categories.');
  });
});
