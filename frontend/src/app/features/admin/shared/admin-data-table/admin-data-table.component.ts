import { Component, Input, Output, EventEmitter, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../../core/services/language.service';
import { CascadeSelectModule } from 'primeng/cascadeselect';

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'badge' | 'date' | 'image' | 'boolean' | 'number';
  badgeClassMap?: Record<string, string>;
  align?: 'left' | 'center' | 'right';
  width?: string;
  nowrap?: boolean;
  formatter?: (value: unknown, row: T) => string;
}

export interface SortEvent {
  key: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-admin-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule, CascadeSelectModule],
  template: `
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <!-- Table Controls: Header, Search, Filters, Create Button -->
      <div class="p-5 border-b border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex-1 max-w-md relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            [ngModel]="searchTerm"
            (ngModelChange)="onSearchInput($event)"
            [placeholder]="isKhmer() ? 'ស្វែងរក...' : searchPlaceholder"
            [class.font-khmer]="isKhmer()"
            class="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
            aria-label="Search records"
          />
          @if (searchTerm) {
            <button
              type="button"
              (click)="clearSearch()"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          }
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Filter Dropdown -->
          @if (filterOptions && filterOptions.length > 0) {
            <div class="relative min-w-[150px]">
              <p-cascadeselect
                [ngModel]="activeFilter"
                (ngModelChange)="onFilterSelect($event)"
                [options]="filterOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Filter"
                appendTo="body"
                styleClass="w-full portfolio-cascadeselect portfolio-cascadeselect-admin"
                ariaLabel="Filter records"
              />
            </div>
          }

          <!-- Create New Action Button -->
          @if (showCreateButton) {
            <button
              type="button"
              (click)="createClick.emit()"
              class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>{{ createButtonLabel }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Main Data Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse" aria-label="Admin Data Table">
          <thead>
            <tr class="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              @for (col of columns; track col.key) {
                <th
                  scope="col"
                  class="px-6 py-3.5 select-none whitespace-nowrap"
                  [style.width]="col.width"
                  [class.cursor-pointer]="col.sortable"
                  [class.text-center]="col.align === 'center'"
                  [class.text-right]="col.align === 'right'"
                  (click)="col.sortable ? onSort(col.key) : null"
                >
                  <div
                    class="inline-flex items-center gap-1.5"
                    [class.justify-center]="col.align === 'center'"
                    [class.justify-end]="col.align === 'right'"
                  >
                    <span>{{ col.label }}</span>
                    @if (col.sortable) {
                      <span class="text-slate-400">
                        @if (sortKey === col.key) {
                          @if (sortDirection === 'asc') {
                            &uarr;
                          } @else {
                            &darr;
                          }
                        } @else {
                          <span class="opacity-40">&udarr;</span>
                        }
                      </span>
                    }
                  </div>
                </th>
              }
              @if (showActions) {
                <th scope="col" class="px-6 py-3.5 text-right w-32 whitespace-nowrap" [class.font-khmer]="isKhmer()">
                  {{ isKhmer() ? 'សកម្មភាព' : 'Actions' }}
                </th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 text-[13px] sm:text-sm">
            <!-- Loading Skeletons -->
            @if (isLoading) {
              @for (row of [1, 2, 3, 4, 5]; track row) {
                <tr class="animate-pulse">
                  @for (col of columns; track col.key) {
                    <td class="px-6 py-4" [style.width]="col.width">
                      <div class="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                    </td>
                  }
                  @if (showActions) {
                    <td class="px-6 py-4 text-right">
                      <div class="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16 ml-auto"></div>
                    </td>
                  }
                </tr>
              }
            } @else if (data && data.length > 0) {
              <!-- Data Rows -->
              @for (item of data; track trackByItem(item)) {
                <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  @for (col of columns; track col.key) {
                    <td
                      class="px-6 py-4 text-slate-700 dark:text-slate-300 align-middle"
                      [style.width]="col.width"
                      [class.text-center]="col.align === 'center'"
                      [class.text-right]="col.align === 'right'"
                      [class.whitespace-nowrap]="col.nowrap || col.type === 'date' || col.type === 'badge' || col.type === 'boolean'"
                    >
                      <!-- Badge Type -->
                      @if (col.type === 'badge') {
                        <span
                          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-2xs"
                          [ngClass]="getBadgeClass(col, getItemValue(item, col.key))"
                        >
                          {{ formatCellValue(col, item) }}
                        </span>
                      }
                      <!-- Image Type -->
                      @else if (col.type === 'image') {
                        <div class="flex items-center" [class.justify-center]="col.align === 'center'">
                          @if (getItemValue(item, col.key)) {
                            <img
                              [src]="getItemString(item, col.key)"
                              [alt]="col.label"
                              class="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-2xs"
                            />
                          } @else {
                            <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          }
                        </div>
                      }
                      <!-- Date Type -->
                      @else if (col.type === 'date') {
                        <span class="text-slate-500 dark:text-slate-400 whitespace-nowrap font-medium">
                          {{ formatDate(getItemValue(item, col.key)) }}
                        </span>
                      }
                      <!-- Boolean Type -->
                      @else if (col.type === 'boolean') {
                        <span class="inline-flex items-center gap-1.5 font-medium whitespace-nowrap" [class.font-khmer]="isKhmer()">
                          <span
                            class="w-2 h-2 rounded-full"
                            [class.bg-emerald-500]="!!getItemValue(item, col.key)"
                            [class.bg-slate-300]="!getItemValue(item, col.key)"
                            [class.dark:bg-slate-600]="!getItemValue(item, col.key)"
                          ></span>
                          <span>{{ isKhmer() ? (getItemValue(item, col.key) ? 'សកម្ម' : 'អសកម្ម') : (getItemValue(item, col.key) ? 'Active' : 'Inactive') }}</span>
                        </span>
                      }
                      <!-- Default / Text Type -->
                      @else {
                        <span class="font-medium text-slate-900 dark:text-white" [class.whitespace-nowrap]="col.nowrap">
                          {{ formatCellValue(col, item) }}
                        </span>
                      }
                    </td>
                  }

                  <!-- Actions Column -->
                  @if (showActions) {
                    <td class="px-6 py-4 text-right align-middle whitespace-nowrap">
                      <div class="inline-flex items-center gap-1">
                        @if (showPublishToggle) {
                          <button
                            type="button"
                            (click)="togglePublishClick.emit(item)"
                            class="p-2 rounded-xl transition-colors cursor-pointer"
                            [class.text-emerald-600]="getItemValue(item, 'status') === 'published'"
                            [class.hover:bg-emerald-50]="getItemValue(item, 'status') === 'published'"
                            [class.dark:hover:bg-emerald-950/50]="getItemValue(item, 'status') === 'published'"
                            [class.text-amber-500]="getItemValue(item, 'status') !== 'published'"
                            [class.hover:bg-amber-50]="getItemValue(item, 'status') !== 'published'"
                            [class.dark:hover:bg-amber-950/50]="getItemValue(item, 'status') !== 'published'"
                            [title]="getItemValue(item, 'status') === 'published' ? (isKhmer() ? 'ដកការផ្សាយ' : 'Unpublish post') : (isKhmer() ? 'ផ្សព្វផ្សាយ' : 'Publish post')"
                            [attr.aria-label]="getItemValue(item, 'status') === 'published' ? 'Unpublish' : 'Publish'"
                          >
                            @if (getItemValue(item, 'status') === 'published') {
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            } @else {
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                            }
                          </button>
                        }
                        <button
                          type="button"
                          (click)="viewClick.emit(item)"
                          class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                          [title]="isKhmer() ? 'មើល' : 'View'"
                          aria-label="View item"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          (click)="editClick.emit(item)"
                          class="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-colors cursor-pointer"
                          [title]="isKhmer() ? 'កែសម្រួល' : 'Edit'"
                          aria-label="Edit item"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          (click)="deleteClick.emit(item)"
                          class="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors cursor-pointer"
                          [title]="isKhmer() ? 'លុប' : 'Delete'"
                          aria-label="Delete item"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  }
                </tr>
              }
            } @else {
              <!-- Empty State -->
              <tr>
                <td [attr.colspan]="columns.length + (showActions ? 1 : 0)" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p class="text-base font-bold text-slate-900 dark:text-white" [class.font-khmer]="isKhmer()">
                      {{ isKhmer() ? 'មិនមានទិន្នន័យត្រូវបានរកឃើញទេ។' : emptyMessage }}
                    </p>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm" [class.font-khmer]="isKhmer()">
                      {{ isKhmer() ? 'ចាប់ផ្តើមដោយការបង្កើតទិន្នន័យថ្មី ឬកែសម្រួលតម្រងស្វែងរករបស់អ្នក។' : 'Get started by creating a new entry or adjust your search filter.' }}
                    </p>
                    @if (showCreateButton) {
                      <button
                        type="button"
                        (click)="createClick.emit()"
                        class="mt-4 px-4 py-2.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl transition-all cursor-pointer"
                        [class.font-khmer]="isKhmer()"
                      >
                        {{ isKhmer() ? (createButtonLabel === 'Create New' ? 'បង្កើតថ្មី' : createButtonLabel) : createButtonLabel }}
                      </button>
                    }
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="p-4 sm:p-5 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
        <div [class.font-khmer]="isKhmer()">
          {{ isKhmer() ? 'បង្ហាញពី' : 'Showing' }}
          <span class="font-semibold text-slate-700 dark:text-slate-300">{{ startItemIndex }}</span>
          {{ isKhmer() ? 'ដល់' : 'to' }}
          <span class="font-semibold text-slate-700 dark:text-slate-300">{{ endItemIndex }}</span>
          {{ isKhmer() ? 'នៃ' : 'of' }}
          <span class="font-semibold text-slate-700 dark:text-slate-300">{{ totalItems }}</span>
          {{ isKhmer() ? 'លទ្ធផល' : 'results' }}
        </div>

        <div class="flex items-center gap-2">
          <!-- Page Size Selector -->
          <div class="flex items-center gap-2 mr-3" [class.font-khmer]="isKhmer()">
            <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">{{ isKhmer() ? 'ក្នុងមួយទំព័រ:' : 'Per page:' }}</span>
            <p-cascadeselect
              id="admin-table-page-size-select"
              inputId="admin-table-page-size-select"
              [ngModel]="pageSize"
              (onChange)="onPageSizeChange($event.value)"
              (ngModelChange)="onPageSizeChange($event)"
              [options]="pageSizeSelectOptions"
              optionLabel="label"
              optionValue="value"
              [placeholder]="pageSize.toString()"
              appendTo="body"
              styleClass="portfolio-cascadeselect portfolio-cascadeselect-compact portfolio-cascadeselect-pagesize"
              [style]="{ width: '74px' }"
              ariaLabel="Items per page"
            />
          </div>

          <!-- Page Navigation Buttons -->
          <button
            type="button"
            (click)="onPageChange(currentPage - 1)"
            [disabled]="currentPage <= 1 || isLoading"
            class="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            [class.font-khmer]="isKhmer()"
            aria-label="Previous Page"
          >
            {{ isKhmer() ? 'មុន' : 'Previous' }}
          </button>
          <span class="px-2 font-semibold text-slate-700 dark:text-slate-300" [class.font-khmer]="isKhmer()">
            {{ isKhmer() ? 'ទំព័រទី ' + currentPage + ' នៃ ' + totalPages : 'Page ' + currentPage + ' of ' + totalPages }}
          </span>
          <button
            type="button"
            (click)="onPageChange(currentPage + 1)"
            [disabled]="currentPage >= totalPages || isLoading"
            class="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            [class.font-khmer]="isKhmer()"
            aria-label="Next Page"
          >
            {{ isKhmer() ? 'បន្ទាប់' : 'Next' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AdminDataTableComponent {
  public readonly languageService = inject(LanguageService, { optional: true });
  public readonly isKhmer = computed(() => this.languageService?.isKhmer() ?? false);

  @Input() columns: TableColumn[] = [];
  @Input() data: Record<string, unknown>[] = [];
  @Input() totalItems = 0;
  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [10, 25, 50];
  @Input() isLoading = false;
  @Input() searchPlaceholder = 'Search...';
  @Input() filterOptions: { label: string; value: string }[] = [];
  @Input() activeFilter = 'all';
  @Input() createButtonLabel = 'Create New';
  @Input() emptyMessage = 'No records found.';
  @Input() showActions = true;
  @Input() showCreateButton = true;
  @Input() showPublishToggle = false;

  @Output() searchChange = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<SortEvent>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() createClick = new EventEmitter<void>();
  @Output() editClick = new EventEmitter<Record<string, unknown>>();
  @Output() deleteClick = new EventEmitter<Record<string, unknown>>();
  @Output() viewClick = new EventEmitter<Record<string, unknown>>();
  @Output() togglePublishClick = new EventEmitter<Record<string, unknown>>();

  public searchTerm = '';
  public sortKey = '';
  public sortDirection: 'asc' | 'desc' = 'asc';

  public get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / (this.pageSize || 10)));
  }

  public get pageSizeSelectOptions(): { label: string; value: number }[] {
    return (this.pageSizeOptions || [10, 25, 50]).map((size) => ({
      label: String(size),
      value: size,
    }));
  }

  public get startItemIndex(): number {
    if (this.totalItems === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  public get endItemIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  public onSearchInput(term: string): void {
    this.searchTerm = term;
    this.searchChange.emit(term);
  }

  public clearSearch(): void {
    this.searchTerm = '';
    this.searchChange.emit('');
  }

  public onFilterSelect(val: string): void {
    this.activeFilter = val;
    this.filterChange.emit(val);
  }

  public onSort(key: string): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.sortChange.emit({ key: this.sortKey, direction: this.sortDirection });
  }

  public onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  public onPageSizeChange(size: number | string | { value?: unknown } | unknown): void {
    let rawVal: unknown = size;
    if (typeof size === 'object' && size !== null && 'value' in size) {
      rawVal = (size as { value: unknown }).value;
    }
    const numSize = Number(rawVal);
    if (!isNaN(numSize) && numSize > 0) {
      this.pageSize = numSize;
      this.pageSizeChange.emit(numSize);
    }
  }

  public formatCellValue(col: TableColumn, item: Record<string, unknown>): string {
    const val = item[col.key];
    if (col.formatter) {
      return col.formatter(val, item);
    }
    if (val === null || val === undefined) return '';
    if (typeof val === 'object' && val !== null && 'en' in val) {
      return String((val as { en?: unknown }).en ?? '');
    }
    return String(val);
  }

  public formatDate(dateVal: unknown): string {
    if (!dateVal) return '—';
    const date = new Date(String(dateVal));
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  public getBadgeClass(col: TableColumn, value: unknown): string {
    const key = String(value ?? '');
    if (col.badgeClassMap && col.badgeClassMap[key]) {
      return col.badgeClassMap[key];
    }
    // Default fallback styles
    if (key === 'published') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
    if (key === 'draft') return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
    return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  }

  public trackByItem(item: Record<string, unknown>): unknown {
    return item['_id'] || item['id'] || item;
  }

  public getItemValue(item: Record<string, unknown>, key: string): unknown {
    return item[key];
  }

  public getItemString(item: Record<string, unknown>, key: string): string {
    return String(item[key] ?? '');
  }
}
