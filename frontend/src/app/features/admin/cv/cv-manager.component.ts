import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared';

@Component({
  selector: 'app-admin-cv-manager',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      <!-- Header -->
      <div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Career Documents
          </span>
        </div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
          CV / Resume Management
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Upload, activate, or replace your official curriculum vitae PDF for public recruitment downloads.
        </p>
      </div>

      <!-- Main Card -->
      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-8">
        <!-- Current Active CV Status -->
        <div class="space-y-4">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Active Curriculum Vitae
          </h2>

          @if (isLoading()) {
            <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 animate-pulse space-y-3">
              <div class="h-5 bg-slate-200 dark:bg-slate-700 rounded w-48"></div>
              <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-64"></div>
            </div>
          } @else if (currentCv()?.cvUrl) {
            <div class="p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-sm text-slate-900 dark:text-white">Official CV Document</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">Active</span>
                  </div>
                  <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono truncate max-w-sm">
                    {{ currentCv()?.cvUrl }}
                  </div>
                  @if (currentCv()?.updatedAt) {
                    <div class="text-[11px] text-slate-400 mt-1">
                      Last uploaded: {{ currentCv()?.updatedAt | date: 'medium' }}
                    </div>
                  }
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-2 self-start sm:self-auto">
                <a
                  [href]="currentCv()?.cvUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all shadow-xs"
                >
                  <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Preview PDF</span>
                </a>

                <button
                  type="button"
                  (click)="onDeleteCv()"
                  class="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors"
                  title="Remove CV"
                  aria-label="Remove CV"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          } @else {
            <div class="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
              <svg class="w-10 h-10 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div class="text-xs font-semibold text-slate-700 dark:text-slate-300">No active CV found</div>
              <p class="text-[11px] text-slate-400 max-w-sm mx-auto">
                Upload your resume PDF below to enable public CV downloads on your header and contact pages.
              </p>
            </div>
          }
        </div>

        <!-- Upload New CV Box -->
        <div class="space-y-4">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Upload / Replace CV
          </h2>

          <div class="p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors text-center space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
            <svg class="w-12 h-12 mx-auto text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div>
              <p class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Upload your new Curriculum Vitae PDF file
              </p>
              <p class="text-[11px] text-slate-400 mt-0.5">
                Maximum file size: 10MB (PDF format only).
              </p>
            </div>

            <input
              #cvFileInput
              type="file"
              accept="application/pdf"
              class="hidden"
              (change)="onFileSelected($event)"
            />

            <button
              type="button"
              (click)="cvFileInput.click()"
              [disabled]="isUploading()"
              class="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50"
            >
              @if (isUploading()) {
                <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Uploading & Activating...</span>
              } @else {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Select & Upload PDF</span>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CvManagerComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  public readonly currentCv = signal<{ cvUrl?: string; cvPublicId?: string; updatedAt?: string } | null>(null);
  public readonly isLoading = signal<boolean>(true);
  public readonly isUploading = signal<boolean>(false);

  public ngOnInit(): void {
    this.loadCv();
  }

  public loadCv(): void {
    this.isLoading.set(true);
    this.portfolioService.getAdminCv().subscribe({
      next: (res) => {
        this.currentCv.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notificationService.showError('Failed to load CV information.');
      },
    });
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (file.type !== 'application/pdf') {
      this.notificationService.showError('Only PDF files are supported.');
      input.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.isUploading.set(true);
    this.portfolioService.uploadAdminCv(formData).subscribe({
      next: () => {
        this.isUploading.set(false);
        this.notificationService.showSuccess('CV uploaded and activated successfully!');
        input.value = '';
        this.loadCv();
      },
      error: (err) => {
        this.isUploading.set(false);
        input.value = '';
        this.notificationService.showError(err?.error?.message || 'Failed to upload CV.');
      },
    });
  }

  public onDeleteCv(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Active CV',
        message: 'Are you sure you want to remove the active CV? Visitors will not be able to download your resume until a new PDF is uploaded.',
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.portfolioService.deleteAdminCv().subscribe({
          next: () => {
            this.notificationService.showSuccess('Active CV deleted successfully.');
            this.currentCv.set(null);
          },
          error: (err) => {
            this.notificationService.showError(err?.error?.message || 'Failed to delete CV.');
          },
        });
      }
    });
  }
}
