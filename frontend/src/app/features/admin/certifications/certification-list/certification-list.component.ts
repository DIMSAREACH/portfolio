import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Certification } from '../../../../core/models';
import { AdminDataTableComponent, TableColumn, SortEvent } from '../../shared';
import { ConfirmDialogComponent } from '../../../../shared';

@Component({
  selector: 'app-admin-certification-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminDataTableComponent],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              CMS Credentials
            </span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Certifications & Honors
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage industry certifications, hackathon awards, honors, and credential verification badges.
          </p>
        </div>

        <a
          routerLink="/admin/certifications/create"
          class="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 self-start sm:self-auto"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>New Certification</span>
        </a>
      </div>

      <!-- Admin Data Table -->
      <app-admin-data-table
        [columns]="columns"
        [data]="asTableData(certifications())"
        [totalItems]="totalItems()"
        [currentPage]="currentPage()"
        [pageSize]="pageSize()"
        [isLoading]="isLoading()"
        [activeFilter]="activeFilter()"
        [filterOptions]="filterOptions"
        searchPlaceholder="Search by title, organization, credential ID..."
        createButtonLabel="New Certification"
        emptyMessage="No credentials found. Add your first certification or honor!"
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
export class CertificationListComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  public readonly certifications = signal<Certification[]>([]);
  public readonly totalItems = signal<number>(0);
  public readonly currentPage = signal<number>(1);
  public readonly pageSize = signal<number>(10);
  public readonly isLoading = signal<boolean>(true);
  public readonly searchTerm = signal<string>('');
  public readonly activeFilter = signal<string>('all');
  public readonly sortKey = signal<string>('issueDate');
  public readonly sortDirection = signal<'asc' | 'desc'>('desc');

  public readonly filterOptions = [
    { label: 'All Types', value: 'all' },
    { label: 'Certifications', value: 'certification' },
    { label: 'Awards', value: 'award' },
    { label: 'Achievements', value: 'achievement' },
  ];

  public readonly columns: TableColumn[] = [
    {
      key: 'image',
      label: 'Badge',
      type: 'image',
      width: '70px',
      align: 'center',
    },
    {
      key: 'name',
      label: 'Credential / Title',
      sortable: true,
      formatter: (_val, row: Record<string, unknown>) => {
        const nameObj = row['name'] as { en?: string; kh?: string } | undefined;
        return nameObj?.en || String(row['name'] || 'Untitled Credential');
      },
    },
    {
      key: 'organization',
      label: 'Issuing Body',
      sortable: true,
      formatter: (_val, row: Record<string, unknown>) => {
        const orgObj = row['organization'] as { en?: string; kh?: string } | undefined;
        return orgObj?.en || String(row['organization'] || '—');
      },
    },
    {
      key: 'type',
      label: 'Category',
      type: 'badge',
      sortable: true,
      align: 'center',
      width: '130px',
      badgeClassMap: {
        certification: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800',
        award: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
        achievement: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
      },
      formatter: (val: unknown) => {
        const str = String(val || '');
        return str.charAt(0).toUpperCase() + str.slice(1);
      },
    },
    {
      key: 'issueDate',
      label: 'Issued',
      type: 'date',
      sortable: true,
      width: '120px',
    },
    {
      key: 'isVisible',
      label: 'Status',
      type: 'badge',
      sortable: true,
      align: 'center',
      width: '110px',
      badgeClassMap: {
        true: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
        false: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
      },
      formatter: (val: unknown) => (val === true ? 'Visible' : 'Hidden'),
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
    this.loadCertifications();
  }

  public loadCertifications(): void {
    this.isLoading.set(true);

    const typeFilter = this.activeFilter() !== 'all' ? this.activeFilter() : undefined;

    this.portfolioService
      .getAdminCertifications({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
        type: typeFilter,
      })
      .subscribe({
        next: (res) => {
          this.certifications.set(res.data.items);
          this.totalItems.set(res.data.pagination.total);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.notificationService.showError('Failed to load certifications list.');
        },
      });
  }

  public onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
    this.loadCertifications();
  }

  public onFilterChange(filterValue: string): void {
    this.activeFilter.set(filterValue);
    this.currentPage.set(1);
    this.loadCertifications();
  }

  public onSortChange(event: SortEvent): void {
    this.sortKey.set(event.key);
    this.sortDirection.set(event.direction);
    this.loadCertifications();
  }

  public onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadCertifications();
  }

  public onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadCertifications();
  }

  public onCreateClick(): void {
    this.router.navigate(['/admin/certifications/create']);
  }

  public onEditClick(row: Record<string, unknown>): void {
    const id = (row['_id'] || row['id']) as string;
    if (id) {
      this.router.navigate(['/admin/certifications', id, 'edit']);
    }
  }

  public onDeleteClick(row: Record<string, unknown>): void {
    const cert = row as unknown as Certification;
    const name = cert.name?.en || 'this certification';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Certification',
        message: `Are you sure you want to permanently delete "${name}"? This action cannot be undone.`,
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.confirmDelete(cert._id);
      }
    });
  }

  public confirmDelete(id: string): void {
    this.portfolioService.deleteAdminCertification(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Certification deleted successfully.');
        this.loadCertifications();
      },
      error: (err) => {
        this.notificationService.showError(err?.error?.message || 'Failed to delete certification.');
      },
    });
  }

  public asTableData(items: Certification[]): Record<string, unknown>[] {
    return items as unknown as Record<string, unknown>[];
  }
}
