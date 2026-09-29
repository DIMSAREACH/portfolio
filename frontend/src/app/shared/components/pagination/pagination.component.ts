import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type PageItem = number | '...';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (totalPages > 1) {
      <nav
        class="flex items-center justify-center gap-1.5 my-6"
        aria-label="Pagination Navigation"
      >
        <!-- Previous Button -->
        <button
          type="button"
          (click)="goToPage(page - 1)"
          [disabled]="page <= 1"
          [class.opacity-40]="page <= 1"
          [class.cursor-not-allowed]="page <= 1"
          class="inline-flex items-center justify-center p-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          aria-label="Previous Page"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <!-- Page Numbers & Ellipses -->
        @for (item of pageNumbers; track $index) {
          @if (item === '...') {
            <!-- Ellipsis -->
            <span
              class="px-2 py-1 text-slate-400 dark:text-slate-500 select-none"
            >
              &hellip;
            </span>
          } @else {
            <!-- Numbered Page -->
            <button
              type="button"
              (click)="goToPage(item)"
              [class.bg-indigo-600]="item === page"
              [class.text-white]="item === page"
              [class.shadow-sm]="item === page"
              [class.hover:bg-indigo-700]="item === page"
              [class.text-slate-700]="item !== page"
              [class.dark:text-slate-200]="item !== page"
              [class.bg-white]="item !== page"
              [class.dark:bg-slate-800]="item !== page"
              [class.border]="item !== page"
              [class.border-slate-200]="item !== page"
              [class.dark:border-slate-700]="item !== page"
              [class.hover:bg-slate-50]="item !== page"
              [class.dark:hover:bg-slate-700/60]="item !== page"
              class="min-w-[2.25rem] h-9 px-3 rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              [attr.aria-current]="item === page ? 'page' : null"
            >
              {{ item }}
            </button>
          }
        }

        <!-- Next Button -->
        <button
          type="button"
          (click)="goToPage(page + 1)"
          [disabled]="page >= totalPages"
          [class.opacity-40]="page >= totalPages"
          [class.cursor-not-allowed]="page >= totalPages"
          class="inline-flex items-center justify-center p-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          aria-label="Next Page"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </nav>
    }
  `,
})
export class PaginationComponent {
  @Input() public page = 1;
  @Input() public totalPages = 1;
  @Input() public siblingCount = 1;

  @Output() public readonly pageChange = new EventEmitter<number>();

  public goToPage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages && newPage !== this.page) {
      this.pageChange.emit(newPage);
    }
  }

  public get pageNumbers(): PageItem[] {
    const total = this.totalPages;
    const current = this.page;
    const siblings = this.siblingCount;

    const totalNumbers = siblings * 2 + 5;

    if (total <= totalNumbers) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(current - siblings, 1);
    const rightSiblingIndex = Math.min(current + siblings, total);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < total - 2;

    const firstPageIndex = 1;
    const lastPageIndex = total;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblings;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', lastPageIndex];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblings;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => total - rightItemCount + 1 + i,
      );
      return [firstPageIndex, '...', ...rightRange];
    }

    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i,
    );
    return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
  }
}
