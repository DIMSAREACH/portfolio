import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class.fixed]="overlay"
      [class.inset-0]="overlay"
      [class.bg-white/70]="overlay"
      [class.dark:bg-slate-900/70]="overlay"
      [class.backdrop-blur-sm]="overlay"
      [class.z-50]="overlay"
      class="flex flex-col items-center justify-center p-4 transition-all duration-300"
      role="status"
      aria-live="polite"
    >
      <div
        [ngClass]="spinnerSizeClass"
        class="relative flex items-center justify-center animate-spin"
      >
        <svg
          class="w-full h-full text-indigo-600 dark:text-indigo-400"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>

      @if (message) {
        <p
          class="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300 animate-pulse text-center"
        >
          {{ message }}
        </p>
      }

      <span class="sr-only">{{ message || 'Loading...' }}</span>
    </div>
  `,
})
export class LoadingSpinnerComponent {
  @Input() public size: 'sm' | 'md' | 'lg' = 'md';
  @Input() public message?: string;
  @Input() public overlay = false;

  public get spinnerSizeClass(): string {
    switch (this.size) {
      case 'sm':
        return 'w-5 h-5';
      case 'lg':
        return 'w-12 h-12';
      case 'md':
      default:
        return 'w-8 h-8';
    }
  }
}
