import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { BlogPost, Category } from '../../../../core/models';
import { AdminDataTableComponent, TableColumn, SortEvent } from '../../shared';
import { ConfirmDialogComponent } from '../../../../shared';

@Component({
  selector: 'app-admin-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, AdminDataTableComponent],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              CMS Articles
            </span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Blog Posts Management
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create, edit, publish, and manage bilingual articles, categories, and markdown content.
          </p>
        </div>

        <a
          routerLink="/admin/blog/create"
          class="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 self-start sm:self-auto"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>New Article</span>
        </a>
      </div>

      <!-- Quick Category Filter Bar -->
      @if (categories().length > 0) {
        <div class="flex flex-wrap items-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
          <span class="text-slate-400 font-semibold px-2">Category:</span>
          <button
            type="button"
            (click)="onCategorySelect('all')"
            class="px-3 py-1.5 rounded-xl font-medium transition-all"
            [class.bg-indigo-600]="selectedCategory() === 'all'"
            [class.text-white]="selectedCategory() === 'all'"
            [class.bg-slate-100]="selectedCategory() !== 'all'"
            [class.dark:bg-slate-800]="selectedCategory() !== 'all'"
            [class.text-slate-600]="selectedCategory() !== 'all'"
            [class.dark:text-slate-300]="selectedCategory() !== 'all'"
          >
            All Categories
          </button>
          @for (cat of categories(); track cat._id) {
            <button
              type="button"
              (click)="onCategorySelect(cat._id)"
              class="px-3 py-1.5 rounded-xl font-medium transition-all"
              [class.bg-indigo-600]="selectedCategory() === cat._id"
              [class.text-white]="selectedCategory() === cat._id"
              [class.bg-slate-100]="selectedCategory() !== cat._id"
              [class.dark:bg-slate-800]="selectedCategory() !== cat._id"
              [class.text-slate-600]="selectedCategory() !== cat._id"
              [class.dark:text-slate-300]="selectedCategory() !== cat._id"
            >
              {{ cat.name.en }}
            </button>
          }
        </div>
      }

      <!-- Admin Data Table Component -->
      <app-admin-data-table
        [columns]="columns"
        [data]="asTableData(blogPosts())"
        [totalItems]="totalItems()"
        [currentPage]="currentPage()"
        [pageSize]="pageSize()"
        [isLoading]="isLoading()"
        [activeFilter]="activeFilter()"
        [filterOptions]="filterOptions"
        [showPublishToggle]="true"
        searchPlaceholder="Search articles by title, tag..."
        createButtonLabel="New Article"
        emptyMessage="No blog posts found. Write your first article!"
        (searchChange)="onSearchChange($event)"
        (filterChange)="onFilterChange($event)"
        (sortChange)="onSortChange($event)"
        (pageChange)="onPageChange($event)"
        (pageSizeChange)="onPageSizeChange($event)"
        (createClick)="onCreateClick()"
        (editClick)="onEditClick($event)"
        (deleteClick)="onDeleteClick($event)"
        (viewClick)="onViewClick($event)"
        (togglePublishClick)="onTogglePublishClick($event)"
      ></app-admin-data-table>
    </div>
  `,
})
export class BlogListComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  public readonly blogPosts = signal<BlogPost[]>([]);
  public readonly categories = signal<Category[]>([]);
  public readonly totalItems = signal<number>(0);
  public readonly currentPage = signal<number>(1);
  public readonly pageSize = signal<number>(10);
  public readonly isLoading = signal<boolean>(true);
  public readonly searchTerm = signal<string>('');
  public readonly activeFilter = signal<string>('all');
  public readonly selectedCategory = signal<string>('all');
  public readonly sortKey = signal<string>('createdAt');
  public readonly sortDirection = signal<'asc' | 'desc'>('desc');

  public readonly filterOptions = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Published', value: 'published' },
    { label: 'Drafts', value: 'draft' },
  ];

  public readonly columns: TableColumn[] = [
    { key: 'coverImage', label: 'Cover', type: 'image', width: '70px', align: 'center' },
    {
      key: 'title',
      label: 'Article Title',
      sortable: true,
      formatter: (_val, row: Record<string, unknown>) => {
        const titleObj = row['title'] as { en?: string; kh?: string } | undefined;
        return titleObj?.en || String(row['title'] || 'Untitled');
      },
    },
    {
      key: 'category',
      label: 'Category',
      formatter: (val) => {
        if (typeof val === 'object' && val !== null && 'name' in val) {
          const cat = val as { name?: { en?: string } };
          return cat.name?.en || 'General';
        }
        return String(val || 'General');
      },
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      sortable: true,
      badgeClassMap: {
        published: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        draft: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      },
    },
    {
      key: 'featured',
      label: 'Featured',
      type: 'boolean',
      align: 'center',
    },
    {
      key: 'readingTime',
      label: 'Read Time',
      align: 'center',
      formatter: (val) => `${val || 1} min`,
    },
    {
      key: 'publishedAt',
      label: 'Published',
      type: 'date',
      sortable: true,
    },
  ];

  public ngOnInit(): void {
    this.loadCategories();
    this.loadBlogPosts();
  }

  public loadCategories(): void {
    this.portfolioService.getCategories('blog').subscribe({
      next: (res) => {
        this.categories.set(res.data || []);
      },
      error: () => {
        // Fallback to all categories if blog specific fails
        this.portfolioService.getCategories().subscribe({
          next: (res) => this.categories.set(res.data || []),
          error: () => {
            /* ignore fallback category error */
          },
        });
      },
    });
  }

  public loadBlogPosts(): void {
    this.isLoading.set(true);

    const params: {
      page: number;
      limit: number;
      search?: string;
      status?: string;
      category?: string;
      sort?: string;
    } = {
      page: this.currentPage(),
      limit: this.pageSize(),
      sort: `${this.sortDirection() === 'desc' ? '-' : ''}${this.sortKey()}`,
    };

    if (this.searchTerm()) {
      params.search = this.searchTerm();
    }

    if (this.activeFilter() !== 'all') {
      params.status = this.activeFilter();
    }

    if (this.selectedCategory() !== 'all') {
      params.category = this.selectedCategory();
    }

    this.portfolioService.getAdminBlogPosts(params).subscribe({
      next: (res) => {
        this.blogPosts.set(res.data.items);
        this.totalItems.set(res.data.pagination.total);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notificationService.showError('Failed to load blog posts.');
      },
    });
  }

  public onCategorySelect(categoryId: string): void {
    this.selectedCategory.set(categoryId);
    this.currentPage.set(1);
    this.loadBlogPosts();
  }

  public onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
    this.loadBlogPosts();
  }

  public onFilterChange(status: string): void {
    this.activeFilter.set(status);
    this.currentPage.set(1);
    this.loadBlogPosts();
  }

  public onSortChange(event: SortEvent): void {
    this.sortKey.set(event.key);
    this.sortDirection.set(event.direction);
    this.loadBlogPosts();
  }

  public onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadBlogPosts();
  }

  public onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadBlogPosts();
  }

  public onCreateClick(): void {
    this.router.navigate(['/admin/blog/create']);
  }

  public onEditClick(row: Record<string, unknown>): void {
    const id = (row['_id'] || row['id']) as string;
    if (id) {
      this.router.navigate(['/admin/blog', id, 'edit']);
    }
  }

  public onViewClick(row: Record<string, unknown>): void {
    const slug = row['slug'] as string;
    if (slug) {
      this.router.navigate(['/blog', slug]);
    }
  }

  public onTogglePublishClick(row: Record<string, unknown>): void {
    const post = row as unknown as BlogPost;
    const isPublished = post.status === 'published';

    if (isPublished) {
      this.portfolioService.unpublishAdminBlogPost(post._id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Post unpublished and set to draft.');
          this.loadBlogPosts();
        },
        error: (err) => {
          this.notificationService.showError(err?.error?.message || 'Failed to unpublish post.');
        },
      });
    } else {
      this.portfolioService.publishAdminBlogPost(post._id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Post published successfully.');
          this.loadBlogPosts();
        },
        error: (err) => {
          this.notificationService.showError(err?.error?.message || 'Failed to publish post.');
        },
      });
    }
  }

  public onDeleteClick(row: Record<string, unknown>): void {
    const post = row as unknown as BlogPost;
    const title = post.title?.en || 'this article';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Article',
        message: `Are you sure you want to permanently delete "${title}"? This action cannot be undone.`,
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.confirmDelete(post._id);
      }
    });
  }

  public confirmDelete(id: string): void {
    this.portfolioService.deleteAdminBlogPost(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Blog post deleted successfully.');
        this.loadBlogPosts();
      },
      error: (err) => {
        this.notificationService.showError(err?.error?.message || 'Failed to delete blog post.');
      },
    });
  }

  public asTableData(items: BlogPost[]): Record<string, unknown>[] {
    return items as unknown as Record<string, unknown>[];
  }
}
