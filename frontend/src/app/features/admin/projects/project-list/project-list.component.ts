import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Project } from '../../../../core/models';
import { AdminDataTableComponent, TableColumn, SortEvent } from '../../shared';
import { ConfirmDialogComponent } from '../../../../shared';

@Component({
  selector: 'app-admin-project-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminDataTableComponent],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              CMS Showcase
            </span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Projects Management
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your developer case studies, tech stack tags, screenshots, and live demo links.
          </p>
        </div>

        <a
          routerLink="/admin/projects/create"
          class="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 self-start sm:self-auto"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>New Project</span>
        </a>
      </div>

      <!-- Admin Data Table Component -->
      <app-admin-data-table
        [columns]="columns"
        [data]="asTableData(projects())"
        [totalItems]="totalItems()"
        [currentPage]="currentPage()"
        [pageSize]="pageSize()"
        [isLoading]="isLoading()"
        [activeFilter]="activeFilter()"
        [filterOptions]="filterOptions"
        searchPlaceholder="Search projects by title, stack..."
        createButtonLabel="New Project"
        emptyMessage="No portfolio projects found."
        (searchChange)="onSearchChange($event)"
        (filterChange)="onFilterChange($event)"
        (sortChange)="onSortChange($event)"
        (pageChange)="onPageChange($event)"
        (pageSizeChange)="onPageSizeChange($event)"
        (createClick)="onCreateClick()"
        (editClick)="onEditClick($event)"
        (deleteClick)="onDeleteClick($event)"
        (viewClick)="onViewClick($event)"
      ></app-admin-data-table>
    </div>
  `,
})
export class ProjectListComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  public readonly projects = signal<Project[]>([]);
  public readonly totalItems = signal<number>(0);
  public readonly currentPage = signal<number>(1);
  public readonly pageSize = signal<number>(10);
  public readonly isLoading = signal<boolean>(true);
  public readonly searchTerm = signal<string>('');
  public readonly activeFilter = signal<string>('all');
  public readonly sortKey = signal<string>('createdAt');
  public readonly sortDirection = signal<'asc' | 'desc'>('desc');

  public readonly filterOptions = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Published', value: 'published' },
    { label: 'Drafts', value: 'draft' },
  ];

  public readonly columns: TableColumn[] = [
    { key: 'mainImage', label: 'Cover', type: 'image', width: '80px', align: 'center' },
    {
      key: 'title',
      label: 'Title',
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
    },
    {
      key: 'featured',
      label: 'Featured',
      type: 'boolean',
      align: 'center',
    },
    {
      key: 'createdAt',
      label: 'Created',
      type: 'date',
      sortable: true,
    },
  ];

  public ngOnInit(): void {
    this.loadProjects();
  }

  public loadProjects(): void {
    this.isLoading.set(true);

    const params: {
      page: number;
      limit: number;
      search?: string;
      status?: string;
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

    this.portfolioService.getAdminProjects(params).subscribe({
      next: (res) => {
        this.projects.set(res.data.items);
        this.totalItems.set(res.data.pagination.total);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notificationService.showError('Failed to load projects.');
      },
    });
  }

  public onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
    this.loadProjects();
  }

  public onFilterChange(status: string): void {
    this.activeFilter.set(status);
    this.currentPage.set(1);
    this.loadProjects();
  }

  public onSortChange(event: SortEvent): void {
    this.sortKey.set(event.key);
    this.sortDirection.set(event.direction);
    this.loadProjects();
  }

  public onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadProjects();
  }

  public onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadProjects();
  }

  public onCreateClick(): void {
    this.router.navigate(['/admin/projects/create']);
  }

  public onEditClick(row: Record<string, unknown>): void {
    const id = (row['_id'] || row['id']) as string;
    if (id) {
      this.router.navigate(['/admin/projects', id, 'edit']);
    }
  }

  public onViewClick(row: Record<string, unknown>): void {
    const slug = row['slug'] as string;
    if (slug) {
      this.router.navigate(['/projects', slug]);
    }
  }

  public onDeleteClick(row: Record<string, unknown>): void {
    const proj = row as unknown as Project;
    const title = proj.title?.en || 'this project';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Project',
        message: `Are you sure you want to permanently delete "${title}"? This action cannot be undone.`,
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.confirmDelete(proj._id);
      }
    });
  }

  public confirmDelete(id: string): void {
    this.portfolioService.deleteAdminProject(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Project deleted successfully.');
        this.loadProjects();
      },
      error: (err) => {
        this.notificationService.showError(err?.error?.message || 'Failed to delete project.');
      },
    });
  }

  public asTableData(items: Project[]): Record<string, unknown>[] {
    return items as unknown as Record<string, unknown>[];
  }
}
