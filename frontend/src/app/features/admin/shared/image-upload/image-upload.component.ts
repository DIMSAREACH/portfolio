import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
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
        <div class="relative group rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900">
          <div [class]="aspectRatioClass" class="w-full flex items-center justify-center overflow-hidden bg-slate-900/5 dark:bg-slate-950">
            <img
              [src]="previewUrl || value"
              alt="Image Preview"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <!-- Overlay with Action Controls -->
          <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
            <button
              type="button"
              (click)="triggerFileInput()"
              [disabled]="disabled"
              class="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Change
            </button>
            <button
              type="button"
              (click)="removeImage()"
              [disabled]="disabled"
              class="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow transition-all focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              Remove
            </button>
          </div>
        </div>
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
export class ImageUploadComponent {
  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  @Input() label?: string;
  @Input() value?: string;
  @Input() required = false;
  @Input() maxSizeMb = 5;
  @Input() acceptedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  @Input() aspectRatio: 'landscape' | 'square' | 'any' = 'landscape';
  @Input() helperText?: string;
  @Input() disabled = false;
  @Input() inputId = 'image-upload-' + Math.random().toString(36).substring(2, 9);

  @Output() fileSelected = new EventEmitter<File>();
  @Output() imageRemoved = new EventEmitter<void>();
  @Output() uploadError = new EventEmitter<string>();

  public previewUrl: string | null = null;
  public errorMessage: string | null = null;
  public isDragging = false;

  public get acceptString(): string {
    return this.acceptedTypes.join(',');
  }

  public get aspectRatioClass(): string {
    if (this.aspectRatio === 'square') return 'aspect-square max-h-64';
    if (this.aspectRatio === 'landscape') return 'aspect-video max-h-72';
    return 'max-h-72';
  }

  public triggerFileInput(): void {
    if (this.disabled) return;
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
    this.imageRemoved.emit();
  }
}
