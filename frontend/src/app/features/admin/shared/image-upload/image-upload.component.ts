import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-2">
      <!-- Label & Requirements -->
      @if (label) {
        <div class="flex items-center justify-between">
          <label [attr.for]="inputId" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {{ label }}
            @if (required) {
              <span class="text-rose-500 font-bold ml-0.5">*</span>
            }
          </label>
          <span class="text-[11px] text-slate-400">Max {{ maxSizeMb }}MB (PNG, JPG, WebP)</span>
        </div>
      }

      <!-- Error Alert -->
      @if (errorMessage) {
        <div class="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between gap-2 text-xs text-rose-700 dark:text-rose-300">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>
          <button
            type="button"
            (click)="errorMessage = null"
            class="text-rose-500 hover:text-rose-700 font-bold text-sm leading-none"
            aria-label="Dismiss error"
          >
            &times;
          </button>
        </div>
      }

      <!-- Image Preview State (When image is present) -->
      @if (previewUrl || value) {
        <div class="relative group rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-xs">
          <!-- Top Floating Action Toolbar -->
          <div class="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
            <!-- Fit / Fill Toggle -->
            <button
              type="button"
              (click)="toggleFitMode($event)"
              class="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 backdrop-blur-md hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              [title]="fitMode === 'contain' ? 'Switch to Fill (crops to fill box)' : 'Switch to Fit (shows entire image clearly)'"
            >
              @if (fitMode === 'contain') {
                <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>Fit Whole</span>
              } @else {
                <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
                </svg>
                <span>Fill Area</span>
              }
            </button>

            <!-- Zoom / Fullscreen Lightbox Button -->
            <button
              type="button"
              (click)="openLightbox($event)"
              class="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700 backdrop-blur-md hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center gap-1 cursor-pointer"
              title="Click to view full size preview"
            >
              <svg class="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
              <span>Zoom</span>
            </button>
          </div>

          <!-- Top Left Mode Indicator -->
          <div class="absolute top-2.5 left-2.5 z-20 pointer-events-none">
            <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-slate-900/75 text-slate-200 backdrop-blur-md shadow-xs">
              {{ fitMode === 'contain' ? 'Entire Image' : 'Cropped Fill' }}
            </span>
          </div>

          <!-- Main Preview Stage with Subtle Checkerboard Canvas -->
          <div
            [class]="aspectRatioClass"
            class="w-full h-72 sm:h-80 flex items-center justify-center overflow-hidden relative p-3 bg-slate-900/5 dark:bg-slate-950/40"
            style="background-image: radial-gradient(rgba(148, 163, 184, 0.25) 1px, transparent 1px); background-size: 14px 14px;"
          >
            <img
              [src]="previewUrl || value"
              alt="Image Preview"
              [class]="fitMode === 'cover' ? 'w-full h-full object-cover object-top' : 'max-w-full max-h-full object-contain rounded-xl shadow-md'"
              class="relative z-10 transition-transform duration-300 group-hover:scale-[1.01]"
            />
          </div>

          <!-- Overlay with Action Controls (Bottom) -->
          <div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
            <button
              type="button"
              (click)="triggerFileInput()"
              [disabled]="disabled"
              class="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
            >
              Change Photo
            </button>
            <button
              type="button"
              (click)="removeImage()"
              [disabled]="disabled"
              class="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>

        <!-- Fullscreen Lightbox Modal -->
        @if (isLightboxOpen) {
          <div
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="Full size image preview"
          >
            <!-- Accessible Backdrop Click Target -->
            <button
              type="button"
              class="fixed inset-0 w-full h-full bg-transparent border-0 cursor-default"
              (click)="closeLightbox()"
              tabindex="-1"
              aria-label="Close modal backdrop"
            ></button>

            <!-- Dialog Content -->
            <div
              class="relative z-10 max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl p-3 border border-slate-700 shadow-2xl flex flex-col items-center"
            >
              <div class="w-full flex items-center justify-between px-3 py-2 border-b border-slate-800 text-slate-200">
                <span class="text-xs font-semibold tracking-wide truncate max-w-[80%]">{{ label || 'Full Size Image Preview' }}</span>
                <button
                  type="button"
                  (click)="closeLightbox()"
                  class="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-lg cursor-pointer"
                  aria-label="Close full view"
                >
                  &times;
                </button>
              </div>
              <div class="p-3 max-h-[78vh] flex items-center justify-center overflow-auto">
                <img
                  [src]="previewUrl || value"
                  alt="Full Size Preview"
                  class="max-h-[72vh] max-w-full object-contain rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        }
      } @else {
        <!-- Drag & Drop Upload Dropzone -->
        <div
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
          (click)="triggerFileInput()"
          class="relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all focus:outline-none"
          [class.border-indigo-500]="isDragging"
          [class.bg-indigo-50/50]="isDragging"
          [class.dark:bg-indigo-950/20]="isDragging"
          [class.border-slate-300]="!isDragging"
          [class.dark:border-slate-700]="!isDragging"
          [class.hover:border-indigo-400]="!disabled && !isDragging"
          [class.hover:bg-slate-50/60]="!disabled && !isDragging"
          [class.dark:hover:bg-slate-800/40]="!disabled && !isDragging"
          [class.opacity-50]="disabled"
          [class.pointer-events-none]="disabled"
          tabindex="0"
          (keydown.enter)="triggerFileInput()"
          (keydown.space)="triggerFileInput()"
          role="button"
          aria-label="Upload image"
        >
          <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 shadow-xs">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="text-xs font-bold text-slate-800 dark:text-slate-200 text-center">
            Click to upload or drag & drop
          </p>
          <p class="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-0.5">
            PNG, JPG, WebP up to {{ maxSizeMb }}MB
          </p>
        </div>
      }

      <!-- Hidden Native File Input -->
      <input
        #fileInput
        [id]="inputId"
        type="file"
        [accept]="acceptString"
        (change)="onFileChange($event)"
        class="hidden"
        [disabled]="disabled"
      />

      <!-- Helper Text -->
      @if (helperText) {
        <p class="text-[11px] text-slate-500 dark:text-slate-400">
          {{ helperText }}
        </p>
      }
    </div>
  `,
})
export class ImageUploadComponent implements OnChanges {
  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  @Input() label?: string;
  @Input() value?: string;
  @Input() required = false;
  @Input() maxSizeMb = 5;
  @Input() acceptedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  @Input() aspectRatio: 'landscape' | 'square' | 'any' = 'landscape';
  @Input() fitMode: 'contain' | 'cover' = 'contain';
  @Input() helperText?: string;
  @Input() disabled = false;
  @Input() inputId = 'image-upload-' + Math.random().toString(36).substring(2, 9);

  @Output() fileSelected = new EventEmitter<File>();
  @Output() imageRemoved = new EventEmitter<void>();
  @Output() uploadError = new EventEmitter<string>();

  public previewUrl: string | null = null;
  public errorMessage: string | null = null;
  public isDragging = false;
  public isLightboxOpen = false;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      // If external value changes (preset avatar chosen, URL typed, or form reset),
      // clear local file preview so external value renders properly
      this.previewUrl = null;
      if (this.fileInputRef?.nativeElement) {
        this.fileInputRef.nativeElement.value = '';
      }
    }
  }

  public get acceptString(): string {
    return this.acceptedTypes.join(',');
  }

  public get aspectRatioClass(): string {
    if (this.aspectRatio === 'square') return 'max-h-80';
    if (this.aspectRatio === 'landscape') return 'max-h-80';
    return 'max-h-80';
  }

  public toggleFitMode(event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.fitMode = this.fitMode === 'contain' ? 'cover' : 'contain';
  }

  public openLightbox(event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.isLightboxOpen = true;
  }

  public closeLightbox(): void {
    this.isLightboxOpen = false;
  }

  public triggerFileInput(): void {
    if (this.disabled) return;
    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
    this.fileInputRef?.nativeElement.click();
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.disabled) {
      this.isDragging = true;
    }
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    if (this.disabled) return;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  public onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  public processFile(file: File): void {
    this.errorMessage = null;

    // Validate MIME type
    if (this.acceptedTypes.length > 0 && !this.acceptedTypes.includes(file.type)) {
      const err = `Unsupported file type (${file.type}). Allowed: JPG, PNG, WebP, GIF.`;
      this.errorMessage = err;
      this.uploadError.emit(err);
      return;
    }

    // Validate file size
    const maxBytes = this.maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      const err = `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum ${this.maxSizeMb}MB limit.`;
      this.errorMessage = err;
      this.uploadError.emit(err);
      return;
    }

    // Generate local preview
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);

    this.fileSelected.emit(file);
  }

  public removeImage(): void {
    this.previewUrl = null;
    this.value = undefined;
    this.errorMessage = null;
    this.isLightboxOpen = false;
    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
    this.imageRemoved.emit();
  }
}
