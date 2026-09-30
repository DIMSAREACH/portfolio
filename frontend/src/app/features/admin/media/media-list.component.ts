import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Media } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared';

@Component({
  selector: 'app-admin-media-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fadeIn pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Cloud Storage & Assets
            </span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Media & Asset Library
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cloudinary media assets, project cover illustrations, and uploaded screenshots.
          </p>
        </div>

        <div>
          <input
            #mediaFileInput
            type="file"
            accept="image/*"
            class="hidden"
            (change)="onFileSelected($event)"
          />
          <button
            type="button"
            (click)="mediaFileInput.click()"
            [disabled]="isUploading()"
            class="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50"
          >
            @if (isUploading()) {
              <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Uploading to Cloud...</span>
            } @else {
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Upload Image</span>
            }
          </button>
        </div>
      </div>

      <!-- Media Grid -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
        @if (isLoading()) {
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            @for (_ of [1, 2, 3, 4, 5, 6, 7, 8]; track $index) {
              <div class="aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
            }
          </div>
        } @else if (mediaItems().length === 0) {
          <div class="py-16 text-center text-slate-400 space-y-3">
            <svg class="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-xs">No media files found in the library. Upload your first asset!</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            @for (item of mediaItems(); track item._id) {
              <div class="group relative rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col">
                <!-- Thumbnail -->
                <div class="aspect-video w-full overflow-hidden bg-slate-900/5 dark:bg-slate-900 relative">
                  <img
                    [src]="item.url"
                    [alt]="item.fileName"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <!-- Hover overlay buttons -->
                  <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      type="button"
                      (click)="copyUrl(item.url)"
                      class="px-2.5 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-900 font-semibold text-[11px] shadow transition-transform active:scale-95 flex items-center gap-1"
                      title="Copy URL to clipboard"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      <span>Copy URL</span>
                    </button>
                    <button
                      type="button"
                      (click)="onDelete(item)"
                      class="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow transition-transform active:scale-95"
                      title="Delete Image"
                      aria-label="Delete image"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Metadata Footer -->
                <div class="p-3 text-[11px] space-y-1">
                  <div class="font-bold text-slate-900 dark:text-white truncate" [title]="item.fileName">
                    {{ item.fileName }}
                  </div>
                  <div class="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                    <span>{{ formatBytes(item.size) }}</span>
                    <span>{{ item.createdAt | date: 'shortDate' }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class MediaListComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  public readonly mediaItems = signal<Media[]>([]);
  public readonly isLoading = signal<boolean>(true);
  public readonly isUploading = signal<boolean>(false);

  public ngOnInit(): void {
    this.loadMedia();
  }

  public loadMedia(): void {
    this.isLoading.set(true);
    this.portfolioService.getAdminMedia().subscribe({
      next: (res) => {
        this.mediaItems.set(res.data.items || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notificationService.showError('Failed to load media assets.');
      },
    });
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('image', file);

    this.isUploading.set(true);
    this.portfolioService.uploadAdminMedia(formData).subscribe({
      next: () => {
        this.isUploading.set(false);
        this.notificationService.showSuccess('Image uploaded to library successfully!');
        input.value = '';
        this.loadMedia();
      },
      error: (err) => {
        this.isUploading.set(false);
        input.value = '';
        this.notificationService.showError(err?.error?.message || 'Failed to upload image.');
      },
    });
  }

  public copyUrl(url: string): void {
    navigator.clipboard.writeText(url).then(
      () => this.notificationService.showSuccess('Image URL copied to clipboard!'),
      () => this.notificationService.showError('Could not copy URL.'),
    );
  }

  public onDelete(item: Media): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Media Asset',
        message: `Are you sure you want to permanently delete "${item.fileName}" from Cloudinary?`,
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.portfolioService.deleteAdminMedia(item._id).subscribe({
          next: () => {
            this.notificationService.showSuccess('Media asset deleted.');
            this.loadMedia();
          },
          error: (err) => {
            this.notificationService.showError(err?.error?.message || 'Failed to delete asset.');
          },
        });
      }
    });
  }

  public formatBytes(bytes: number): string {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }
}
