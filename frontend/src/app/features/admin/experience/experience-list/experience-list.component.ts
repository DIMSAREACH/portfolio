import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Experience } from '../../../../core/models';
import { AdminDataTableComponent, TableColumn, SortEvent } from '../../shared';
import { ConfirmDialogComponent } from '../../../../shared';

@Component({
  selector: 'app-admin-experience-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminDataTableComponent],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              CMS Career & Roles
            </span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Experience & Engagements
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your employment history, voluntary roles, internships, and freelance milestones.
          </p>
        </div>

        <a
          routerLink="/admin/experience/create"
          class="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 self-start sm:self-auto"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>New Experience</span>
        </a>
      </div>

      <!-- Admin Data Table -->
      <app-admin-data-table
        [columns]="columns"
        [data]="asTableData(experiences())"
        [totalItems]="totalItems()"
        [currentPage]="currentPage()"
        [pageSize]="pageSize()"
        [isLoading]="isLoading()"
        [activeFilter]="activeFilter()"
        [filterOptions]="filterOptions"
        searchPlaceholder="Search by role, company, tech stack..."
        createButtonLabel="New Experience"
        emptyMessage="No experiences found. Add your first career milestone!"
        (searchChange)="onSearchChange($event)"
        (filterChange)="onFilterChange($event)"
        (sortChange)="onSortChange($event)"
        (pageChange)="onPageChange($event)"
        (pageSizeChange)="onPageSizeChange($event)"
        (createClick)="onCreateClick()"
        (editClick)="onEditClick($event)"
        (deleteClick)="onDeleteClick($event)"
      ></app-admin-data-table>
    </div>
  `,
})
export class ExperienceListComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  public readonly experiences = signal<Experience[]>([]);
  public readonly totalItems = signal<number>(0);
  public readonly currentPage = signal<number>(1);
  public readonly pageSize = signal<number>(10);
  public readonly isLoading = signal<boolean>(true);
  public readonly searchTerm = signal<string>('');
  public readonly activeFilter = signal<string>('all');
  public readonly sortKey = signal<string>('startDate');
  public readonly sortDirection = signal<'asc' | 'desc'>('desc');

  public readonly filterOptions = [
    { label: 'All Types', value: 'all' },
    { label: 'Work', value: 'work' },
    { label: 'Volunteer', value: 'volunteer' },
    { label: 'Internship', value: 'internship' },
    { label: 'Freelance', value: 'freelance' },
  ];

  public readonly columns: TableColumn[] = [
    {
      key: 'title',
      label: 'Position / Role',
      sortable: true,
      formatter: (_val, row: Record<string, unknown>) => {
        const titleObj = row['title'] as { en?: string; kh?: string } | undefined;
        return titleObj?.en || String(row['title'] || 'Untitled Role');
      },
    },
    {
      key: 'organization',
      label: 'Organization',
      sortable: true,
      formatter: (_val, row: Record<string, unknown>) => {
        const orgObj = row['organization'] as { en?: string; kh?: string } | undefined;
        return orgObj?.en || String(row['organization'] || '—');
      },
    },
    {
      key: 'type',
      label: 'Type',
      type: 'badge',
      sortable: true,
      align: 'center',
      width: '120px',
      badgeClassMap: {
        work: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800',
        volunteer: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
        internship: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200 dark:border-purple-800',
        freelance: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
      },
      formatter: (val: unknown) => {
        const str = String(val || '');
        return str.charAt(0).toUpperCase() + str.slice(1);
      },
    },
    {
      key: 'period',
      label: 'Timeline',
      sortable: false,
      formatter: (_val, row: Record<string, unknown>) => {
        const start = row['startDate'] ? new Date(String(row['startDate'])).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '—';
        const isCurrent = row['isCurrent'] === true;
        const end = isCurrent
          ? 'Present'
          : row['endDate']
            ? new Date(String(row['endDate'])).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })
            : '—';
        return `${start} – ${end}`;
      },
    },
    {
      key: 'isCurrent',
      label: 'Status',
      type: 'badge',
      sortable: true,
      align: 'center',
      width: '110px',
      badgeClassMap: {
        true: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
        false: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
      },
      formatter: (val: unknown) => (val === true ? 'Current' : 'Completed'),
    },
    {
      key: 'order',
      label: 'Order',
      sortable: true,
      align: 'center',
      width: '80px',
    },
  ];

  public ngOnInit(): void {
    this.loadExperiences();
  }

  public loadExperiences(): void {
    this.isLoading.set(true);

    const typeFilter = this.activeFilter() !== 'all' ? this.activeFilter() : undefined;

    this.portfolioService
      .getAdminExperiences({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
        type: typeFilter,
      })
      .subscribe({
        next: (res) => {
          this.experiences.set(res.data.items);
          this.totalItems.set(res.data.pagination.total);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.notificationService.showError('Failed to load experiences list.');
        },
      });
  }

  public onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
    this.loadExperiences();
  }

  public onFilterChange(filterValue: string): void {
    this.activeFilter.set(filterValue);
    this.currentPage.set(1);
    this.loadExperiences();
  }

  public onSortChange(event: SortEvent): void {
    this.sortKey.set(event.key);
    this.sortDirection.set(event.direction);
    this.loadExperiences();
  }

  public onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadExperiences();
  }

  public onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadExperiences();
  }

  public onCreateClick(): void {
    this.router.navigate(['/admin/experience/create']);
  }

  public onEditClick(row: Record<string, unknown>): void {
    const id = (row['_id'] || row['id']) as string;
    if (id) {
      this.router.navigate(['/admin/experience', id, 'edit']);
    }
  }

  public onDeleteClick(row: Record<string, unknown>): void {
    const exp = row as unknown as Experience;
    const title = exp.title?.en || 'this experience entry';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Experience',
        message: `Are you sure you want to permanently delete "${title}"? This action cannot be undone.`,
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.confirmDelete(exp._id);
      }
    });
  }

  public confirmDelete(id: string): void {
    this.portfolioService.deleteAdminExperience(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Experience deleted successfully.');
        this.loadExperiences();
      },
      error: (err) => {
        this.notificationService.showError(err?.error?.message || 'Failed to delete experience.');
      },
    });
  }

  public asTableData(items: Experience[]): Record<string, unknown>[] {
    return items as unknown as Record<string, unknown>[];
  }
}
