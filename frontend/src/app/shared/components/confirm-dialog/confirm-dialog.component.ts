import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <div
      class="p-6 max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800"
    >
      <div class="flex items-start gap-4">
        <!-- Icon -->
        <div
          [class.bg-rose-100]="data.isDestructive"
          [class.text-rose-600]="data.isDestructive"
          [class.dark:bg-rose-950/60]="data.isDestructive"
          [class.dark:text-rose-400]="data.isDestructive"
          [class.bg-indigo-100]="!data.isDestructive"
          [class.text-indigo-600]="!data.isDestructive"
          [class.dark:bg-indigo-950/60]="!data.isDestructive"
          [class.dark:text-indigo-400]="!data.isDestructive"
          class="shrink-0 p-3 rounded-full"
        >
          @if (data.isDestructive) {
            <!-- Warning / Alert Triangle SVG if destructive -->
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          } @else {
            <!-- Info / Question SVG if non-destructive -->
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        </div>

        <div class="flex-1">
          <h3
            mat-dialog-title
            class="!m-0 text-lg font-bold text-slate-900 dark:text-slate-100"
          >
            {{ data.title }}
          </h3>
          <p
            class="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            {{ data.message }}
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          (click)="onCancel()"
          class="px-4 py-2 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          {{ data.cancelText || 'Cancel' }}
        </button>

        <button
          type="button"
          (click)="onConfirm()"
          [class.bg-rose-600]="data.isDestructive"
          [class.hover:bg-rose-700]="data.isDestructive"
          [class.focus:ring-rose-500/50]="data.isDestructive"
          [class.bg-indigo-600]="!data.isDestructive"
          [class.hover:bg-indigo-700]="!data.isDestructive"
          [class.focus:ring-indigo-500/50]="!data.isDestructive"
          class="px-4 py-2 text-sm font-medium rounded-xl text-white shadow-sm transition-colors focus:outline-none focus:ring-2"
        >
          {{ data.confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  public readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  public readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onConfirm(): void {
    this.dialogRef.close(true);
  }
}
