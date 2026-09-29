import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30 backdrop-blur-sm max-w-lg mx-auto my-6"
    >
      <div
        class="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
      >
        <ng-content select="[icon]">
          <!-- Default fallback empty box SVG -->
          <svg
            class="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </ng-content>
      </div>

      <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">
        {{ title }}
      </h3>

      @if (description) {
        <p class="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5">
          {{ description }}
        </p>
      }

      @if (actionText || hasProjectedAction) {
        <div class="flex gap-3">
          @if (actionText) {
            <button
              type="button"
              (click)="actionClick.emit()"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {{ actionText }}
            </button>
          }

          <ng-content select="[action]"></ng-content>
        </div>
      }
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() public title = 'No items found';
  @Input() public description?: string;
  @Input() public actionText?: string;
  @Input() public hasProjectedAction = false;

  @Output() public readonly actionClick = new EventEmitter<void>();
}
