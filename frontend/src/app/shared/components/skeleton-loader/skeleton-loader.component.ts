import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonType = 'text' | 'title' | 'circle' | 'card' | 'image' | 'button';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-3 w-full" aria-hidden="true">
      @for (item of items; track item) {
        @if (type === 'card') {
          <!-- Card Skeleton -->
          <div
            class="p-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/50 dark:bg-slate-800/40 animate-pulse space-y-4"
            [ngClass]="className"
          >
            <div class="h-44 w-full bg-slate-200 dark:bg-slate-700/60 rounded-xl"></div>
            <div class="h-5 w-3/4 bg-slate-200 dark:bg-slate-700/60 rounded"></div>
            <div class="space-y-2">
              <div class="h-3.5 w-full bg-slate-200 dark:bg-slate-700/60 rounded"></div>
              <div class="h-3.5 w-5/6 bg-slate-200 dark:bg-slate-700/60 rounded"></div>
            </div>
            <div class="flex gap-2 pt-2">
              <div class="h-6 w-16 bg-slate-200 dark:bg-slate-700/60 rounded-full"></div>
              <div class="h-6 w-16 bg-slate-200 dark:bg-slate-700/60 rounded-full"></div>
            </div>
          </div>
        } @else if (type === 'circle') {
          <!-- Circle (Avatar / Icon) Skeleton -->
          <div
            class="rounded-full bg-slate-200 dark:bg-slate-700/60 animate-pulse shrink-0"
            [style.width]="width || '3rem'"
            [style.height]="height || '3rem'"
            [ngClass]="className"
          ></div>
        } @else if (type === 'image') {
          <!-- Image Skeleton -->
          <div
            class="w-full bg-slate-200 dark:bg-slate-700/60 rounded-xl animate-pulse"
            [style.width]="width"
            [style.height]="height || '12rem'"
            [ngClass]="className"
          ></div>
        } @else if (type === 'title') {
          <!-- Title Skeleton -->
          <div
            class="h-7 w-2/3 bg-slate-200 dark:bg-slate-700/60 rounded-lg animate-pulse"
            [style.width]="width"
            [style.height]="height"
            [ngClass]="className"
          ></div>
        } @else if (type === 'button') {
          <!-- Button Skeleton -->
          <div
            class="h-10 w-28 bg-slate-200 dark:bg-slate-700/60 rounded-lg animate-pulse"
            [style.width]="width"
            [style.height]="height"
            [ngClass]="className"
          ></div>
        } @else {
          <!-- Text Line Skeleton (Default) -->
          <div
            class="h-4 w-full bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse"
            [style.width]="width"
            [style.height]="height"
            [ngClass]="className"
          ></div>
        }
      }
    </div>
  `,
})
export class SkeletonLoaderComponent {
  @Input() public type: SkeletonType = 'text';
  @Input() public count = 1;
  @Input() public width?: string;
  @Input() public height?: string;
  @Input() public className = '';

  public get items(): number[] {
    return Array.from({ length: Math.max(1, this.count) }, (_, i) => i);
  }
}
