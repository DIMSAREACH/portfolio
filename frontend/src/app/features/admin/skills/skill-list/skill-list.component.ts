import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Skill } from '../../../../core/models';
import { AdminDataTableComponent, TableColumn, SortEvent } from '../../shared';
import { ConfirmDialogComponent } from '../../../../shared';

@Component({
  selector: 'app-admin-skill-list',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminDataTableComponent],
  template: `
    <div class="space-y-6 animate-fadeIn">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              CMS Expertise
            </span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Skills & Competencies
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organize tech stack proficiencies, bilingual category groupings, and display priorities.
          </p>
        </div>

        <a
          routerLink="/admin/skills/create"
          class="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 self-start sm:self-auto"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>New Skill</span>
        </a>
      </div>

      <!-- Admin Data Table -->
      <app-admin-data-table
        [columns]="columns"
        [data]="asTableData(skills())"
        [totalItems]="totalItems()"
        [currentPage]="currentPage()"
        [pageSize]="pageSize()"
        [isLoading]="isLoading()"
        [activeFilter]="activeFilter()"
        [filterOptions]="filterOptions"
        searchPlaceholder="Search skills by name, category..."
        createButtonLabel="New Skill"
        emptyMessage="No skills found. Create your first technical skill!"
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
export class SkillListComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  public readonly skills = signal<Skill[]>([]);
  public readonly totalItems = signal<number>(0);
  public readonly currentPage = signal<number>(1);
  public readonly pageSize = signal<number>(10);
  public readonly isLoading = signal<boolean>(true);
  public readonly searchTerm = signal<string>('');
  public readonly activeFilter = signal<string>('all');
  public readonly sortKey = signal<string>('order');
  public readonly sortDirection = signal<'asc' | 'desc'>('asc');

  public readonly filterOptions = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Visible', value: 'true' },
    { label: 'Hidden', value: 'false' },
  ];

  public readonly columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Skill Name',
      sortable: true,
      formatter: (_val, row: Record<string, unknown>) => {
        const icon = (row['icon'] as string) || '';
        const name = String(row['name'] || 'Unnamed Skill');
        return icon ? `${name} (${icon})` : name;
      },
    },
    {
      key: 'category',
      label: 'Category',
      sortable: false,
      formatter: (_val, row: Record<string, unknown>) => {
        const cat = row['category'] as { en?: string; kh?: string } | undefined;
        if (!cat) return 'Uncategorized';
        if (cat.en && cat.kh && cat.en !== cat.kh) {
          return `${cat.en} / ${cat.kh}`;
        }
        return cat.en || cat.kh || 'Uncategorized';
      },
    },
    {
      key: 'order',
      label: 'Order',
      sortable: true,
      align: 'center',
      width: '90px',
    },
    {
      key: 'isVisible',
      label: 'Visibility',
      type: 'badge',
      sortable: true,
      align: 'center',
      width: '120px',
      badgeClassMap: {
        true: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
        false: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700',
      },
      formatter: (val: unknown) => (val === true ? 'Visible' : 'Hidden'),
    },
    {
      key: 'createdAt',
      label: 'Created',
      type: 'date',
      sortable: true,
      width: '130px',
    },
  ];

  public ngOnInit(): void {
    this.loadSkills();
  }

  public loadSkills(): void {
    this.isLoading.set(true);

    const isVisibleFilter =
      this.activeFilter() === 'true'
        ? true
        : this.activeFilter() === 'false'
          ? false
          : undefined;

    this.portfolioService
      .getAdminSkills({
        page: this.currentPage(),
        limit: this.pageSize(),
        search: this.searchTerm() || undefined,
        isVisible: isVisibleFilter,
      })
      .subscribe({
        next: (res) => {
          this.skills.set(res.data.items);
          this.totalItems.set(res.data.pagination.total);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.notificationService.showError('Failed to load skills list.');
        },
      });
  }

  public onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
    this.loadSkills();
  }

  public onFilterChange(filterValue: string): void {
    this.activeFilter.set(filterValue);
    this.currentPage.set(1);
    this.loadSkills();
  }

  public onSortChange(event: SortEvent): void {
    this.sortKey.set(event.key);
    this.sortDirection.set(event.direction);
    this.loadSkills();
  }

  public onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadSkills();
  }

  public onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
    this.loadSkills();
  }

  public onCreateClick(): void {
    this.router.navigate(['/admin/skills/create']);
  }

  public onEditClick(row: Record<string, unknown>): void {
    const id = (row['_id'] || row['id']) as string;
    if (id) {
      this.router.navigate(['/admin/skills', id, 'edit']);
    }
  }

  public onDeleteClick(row: Record<string, unknown>): void {
    const skill = row as unknown as Skill;
    const name = skill.name || 'this skill';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Skill',
        message: `Are you sure you want to permanently delete "${name}"? This will remove it from your public portfolio.`,
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.confirmDelete(skill._id);
      }
    });
  }

  public confirmDelete(id: string): void {
    this.portfolioService.deleteAdminSkill(id).subscribe({
      next: () => {
        this.notificationService.showSuccess('Skill deleted successfully.');
        this.loadSkills();
      },
      error: (err) => {
        this.notificationService.showError(err?.error?.message || 'Failed to delete skill.');
      },
    });
  }

  public asTableData(items: Skill[]): Record<string, unknown>[] {
    return items as unknown as Record<string, unknown>[];
  }
}
