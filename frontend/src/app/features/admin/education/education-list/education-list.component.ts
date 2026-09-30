import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Education } from '../../../../core/models';
import { AdminDataTableComponent, TableColumn, SortEvent } from '../../shared';
import { ConfirmDialogComponent } from '../../../../shared';

@Component({
  selector: 'app-admin-education-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminDataTableComponent],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              CMS Academics
            </span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Education & Degrees
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage academic degrees, institutions, study disciplines, timelines, and honors.
          </p>
        </div>

        <a
          routerLink="/admin/education/create"
          class="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 self-start sm:self-auto"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>New Education</span>
        </a>
      </div>

      <!-- Admin Data Table -->
      <app-admin-data-table
        [columns]="columns"
        [data]="asTableData(educationList())"
        [totalItems]="totalItems()"
        [currentPage]="currentPage()"
        [pageSize]="pageSize()"
        [isLoading]="isLoading()"
        searchPlaceholder="Search by school, degree, field of study..."
        createButtonLabel="New Education"
        emptyMessage="No education records found. Add your first academic degree!"
        (searchChange)="onSearchChange($event)"
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
export class EducationListComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  public readonly educationList = signal<Education[]>([]);
  public readonly totalItems = signal<number>(0);
  public readonly currentPage = signal<number>(1);
  public readonly pageSize = signal<number>(10);
  public readonly isLoading = signal<boolean>(true);
  public readonly searchTerm = signal<string>('');
  public readonly sortKey = signal<string>('startYear');
  public readonly sortDirection = signal<'asc' | 'desc'>('desc');

  public readonly columns: TableColumn[] = [
    {
      key: 'institution',
      label: 'Institution / University',
      sortable: true,
      formatter: (_val, row: Record<string, unknown>) => {
        const inst = row['institution'] as { en?: string; kh?: string } | undefined;
        return inst?.en || String(row['institution'] || '—');
      },
    },
    {
      key: 'degree',
      label: 'Degree',
      sortable: true,
      formatter: (_val, row: Record<string, unknown>) => {
        const deg = row['degree'] as { en?: string; kh?: string } | undefined;
        return deg?.en || String(row['degree'] || '—');
      },
    },
    {
      key: 'field',
      label: 'Major / Field',
      sortable: true,
      formatter: (_val, row: Record<string, unknown>) => {
        const fld = row['field'] as { en?: string; kh?: string } | undefined;
        return fld?.en || String(row['field'] || '—');
      },
    },
    {
      key: 'period',
      label: 'Years',
      sortable: false,
      align: 'center',
      width: '140px',
      formatter: (_val, row: Record<string, unknown>) => {
        const start = row['startYear'] || '—';
        const end = row['endYear'] ? String(row['endYear']) : 'Present';
        return `${start} – ${end}`;
      },
    },
    {
      key: 'gpa',
      label: 'GPA / Grade',
      sortable: false,
      align: 'center',
      width: '120px',
      formatter: (val) => String(val || '—'),
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
    this.loadEducation();
  }

  public loadEducation(): void {
    this.isLoading.set(true);

    this.portfolioService
      .getAdminEducation({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
      })
      .subscribe({
        next: (res) => {
          this.educationList.set(res.data.items);
          this.totalItems.set(res.data.pagination.total);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.notificationService.showError('Failed to load education records.');
        },
      });
  }

  public onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
    this.loadEducation();
  }

  public onSortChange(event: SortEvent): void {
    this.sortKey.set(event.key);
    this.sortDirection.set(event.direction);
    this.loadEducation();
  }

  public onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadEducation();
  }

  public onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadEducation();
  }

  public onCreateClick(): void {
    this.router.navigate(['/admin/education/create']);
  }

  public onEditClick(row: Record<string, unknown>): void {
    const id = (row['_id'] || row['id']) as string;
    if (id) {
      this.router.navigate(['/admin/education', id, 'edit']);
    }
  }

  public onDeleteClick(row: Record<string, unknown>): void {
    const edu = row as unknown as Education;
    const inst = edu.institution?.en || 'this education record';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Education',
        message: `Are you sure you want to permanently delete "${inst}"? This action cannot be undone.`,
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.confirmDelete(edu._id);
      }
    });
  }

  public confirmDelete(id: string): void {
    this.portfolioService.deleteAdminEducation(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Education record deleted successfully.');
        this.loadEducation();
      },
      error: (err) => {
        this.notificationService.showError(err?.error?.message || 'Failed to delete education.');
      },
    });
  }

  public asTableData(items: Education[]): Record<string, unknown>[] {
    return items as unknown as Record<string, unknown>[];
  }
}
