import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { BlogPost, Category, BlogPostStatus } from '../../../../core/models';
import { BilingualFieldComponent, ImageUploadComponent, MarkdownEditorComponent } from '../../shared';

@Component({
  selector: 'app-admin-blog-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    BilingualFieldComponent,
    ImageUploadComponent,
    MarkdownEditorComponent,
  ],
  template: `
    <div class="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      <!-- Breadcrumb & Top Bar -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <a routerLink="/admin/blog" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Blog Posts
          </a>
          <span>/</span>
          <span class="text-slate-900 dark:text-white font-medium">
            {{ isEditMode() ? 'Edit Article' : 'Create Article' }}
          </span>
        </div>

        <a
          routerLink="/admin/blog"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Articles</span>
        </a>
      </div>

      <!-- Header Title -->
      <div>
        <h1 class="text-2xl font-black text-slate-900 dark:text-white">
          {{ isEditMode() ? 'Edit Blog Article' : 'Create New Blog Article' }}
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Compose your technical write-up with bilingual metadata, categorization, tags, and Markdown formatting.
        </p>
      </div>

      <!-- Main Form -->
      <form [formGroup]="blogForm" (ngSubmit)="onSubmit()" class="space-y-8">
        <!-- Section 1: Core Article Metadata & Slug -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Article Title & URL Slug
          </h2>

          <!-- Bilingual Title -->
          <div>
            <app-bilingual-field
              label="Article Title"
              [required]="true"
              placeholderEn="e.g. Master Angular Signals in 10 Minutes"
              placeholderKh="e.g. ស្វែងយល់ស៊ីជម្រៅពី Angular Signals ក្នុង ១០ នាទី"
              formControlName="title"
            ></app-bilingual-field>
            @if (isFieldInvalid('title')) {
              <p class="text-[11px] text-rose-500 font-medium mt-1">
                English article title is required.
              </p>
            }
          </div>

          <!-- URL Slug Field with Auto Generate -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label for="post-slug-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                URL Slug <span class="text-rose-500 font-bold ml-0.5">*</span>
              </label>
              <button
                type="button"
                (click)="autoGenerateSlug()"
                class="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerate from Title
              </button>
            </div>
            <div class="flex rounded-xl shadow-xs overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
              <span class="inline-flex items-center px-3.5 text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 font-mono select-none">
                /blog/
              </span>
              <input
                id="post-slug-input"
                type="text"
                formControlName="slug"
                placeholder="master-angular-signals-in-10-minutes"
                class="flex-1 px-3.5 py-2 text-xs text-slate-900 dark:text-white bg-transparent focus:outline-none font-mono"
              />
            </div>
            <p class="text-[11px] text-slate-400">
              Unique URL identifier for the article (letters, numbers, hyphens only).
            </p>
            @if (isFieldInvalid('slug')) {
              <p class="text-[11px] text-rose-500 font-medium">Valid slug is required.</p>
            }
          </div>

          <!-- Bilingual Excerpt -->
          <div>
            <app-bilingual-field
              label="Article Excerpt (Summary)"
              fieldType="textarea"
              [required]="true"
              placeholderEn="A brief, engaging hook summarizing key insights..."
              placeholderKh="សង្ខេបចំណុចសំខាន់ៗនៃអត្ថបទនេះ..."
              formControlName="excerpt"
              [rows]="3"
            ></app-bilingual-field>
            @if (isFieldInvalid('excerpt')) {
              <p class="text-[11px] text-rose-500 font-medium mt-1">
                English summary excerpt is required.
              </p>
            }
          </div>
        </div>

        <!-- Section 2: Publishing & Taxonomy -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Publishing, Category & Tags
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Category Selector -->
            <div>
              <label for="post-category-select" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category <span class="text-rose-500 font-bold ml-0.5">*</span>
              </label>
              <select
                id="post-category-select"
                formControlName="category"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
              >
                <option value="" disabled>Select category...</option>
                @for (cat of categories(); track cat._id) {
                  <option [value]="cat._id">{{ cat.name.en }} ({{ cat.name.kh }})</option>
                }
              </select>
              @if (isFieldInvalid('category')) {
                <p class="text-[11px] text-rose-500 font-medium mt-1">Category is required.</p>
              }
            </div>

            <!-- Status Selector -->
            <div>
              <label for="post-status-select" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Publication Status <span class="text-rose-500 font-bold ml-0.5">*</span>
              </label>
              <select
                id="post-status-select"
                formControlName="status"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer font-medium"
              >
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Public)</option>
              </select>
            </div>

            <!-- Featured Article Toggle -->
            <div class="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 self-end">
              <div>
                <span class="block text-xs font-semibold text-slate-900 dark:text-white">Featured Post</span>
                <span class="text-[11px] text-slate-400">Highlight on home and blog headers</span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer ml-3">
                <input
                  type="checkbox"
                  formControlName="featured"
                  class="sr-only peer"
                />
                <div class="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 dark:bg-slate-700"></div>
              </label>
            </div>
          </div>

          <!-- Tags Manager -->
          <div class="space-y-3 pt-2">
            <label for="post-tag-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Article Tags
            </label>
            <div class="flex items-center gap-2">
              <input
                id="post-tag-input"
                type="text"
                [(ngModel)]="newTagInput"
                [ngModelOptions]="{ standalone: true }"
                (keydown.enter)="$event.preventDefault(); addTag()"
                placeholder="Add tag (e.g. Architecture, NestJS, Cloud)..."
                class="flex-1 max-w-sm px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <button
                type="button"
                (click)="addTag()"
                class="px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl transition-all"
              >
                Add Tag
              </button>
            </div>

            <!-- Tags Chips -->
            <div class="flex flex-wrap items-center gap-2 pt-1">
              @for (tag of tagsList; track $index) {
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <span>#{{ tag }}</span>
                  <button
                    type="button"
                    (click)="removeTag($index)"
                    class="text-slate-400 hover:text-rose-500 transition-colors"
                    aria-label="Remove tag"
                  >
                    &times;
                  </button>
                </span>
              }
              @if (tagsList.length === 0) {
                <span class="text-xs text-slate-400 italic">No tags added yet.</span>
              }
            </div>
          </div>
        </div>

        <!-- Section 3: Cover Image Upload -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Cover Media
          </h2>

          <div class="space-y-4">
            <app-image-upload
              label="Article Hero Cover Image"
              helperText="Recommended 16:9 banner landscape image (JPEG, PNG, WebP)."
              [value]="blogForm.get('coverImage')?.value"
              (fileSelected)="onImageSelected($event)"
              (imageRemoved)="onImageRemoved()"
            ></app-image-upload>

            <div>
              <label for="post-cover-image-url-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Or Direct Image URL
              </label>
              <input
                id="post-cover-image-url-input"
                type="url"
                formControlName="coverImage"
                placeholder="https://images.unsplash.com/photo-..."
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
              />
            </div>
          </div>
        </div>

        <!-- Section 4: Bilingual Markdown Content -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Article Body Content (Markdown)
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">
                Use the Write, Preview, or Split mode to compose rich formatted content with live preview.
              </p>
            </div>

            <!-- Content Language Switcher Tabs -->
            <div class="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto" role="tablist">
              <button
                type="button"
                role="tab"
                (click)="activeContentLang.set('en')"
                class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
                [class.bg-white]="activeContentLang() === 'en'"
                [class.dark:bg-slate-700]="activeContentLang() === 'en'"
                [class.text-indigo-600]="activeContentLang() === 'en'"
                [class.dark:text-indigo-400]="activeContentLang() === 'en'"
                [class.shadow-xs]="activeContentLang() === 'en'"
                [class.text-slate-500]="activeContentLang() !== 'en'"
                [class.dark:text-slate-400]="activeContentLang() !== 'en'"
              >
                English Markdown
                <span class="ml-1 text-[10px] text-rose-500 font-bold">*</span>
              </button>
              <button
                type="button"
                role="tab"
                (click)="activeContentLang.set('kh')"
                class="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
                [class.bg-white]="activeContentLang() === 'kh'"
                [class.dark:bg-slate-700]="activeContentLang() === 'kh'"
                [class.text-indigo-600]="activeContentLang() === 'kh'"
                [class.dark:text-indigo-400]="activeContentLang() === 'kh'"
                [class.shadow-xs]="activeContentLang() === 'kh'"
                [class.text-slate-500]="activeContentLang() !== 'kh'"
                [class.dark:text-slate-400]="activeContentLang() !== 'kh'"
              >
                Khmer Markdown
              </button>
            </div>
          </div>

          <div formGroupName="content">
            <!-- English Markdown Tab -->
            <div [class.hidden]="activeContentLang() !== 'en'">
              <app-markdown-editor
                label="English Article Body"
                [required]="true"
                placeholder="# Introduction&#10;&#10;Write your English technical article in Markdown here..."
                [rows]="16"
                formControlName="en"
              ></app-markdown-editor>
              @if (isContentEnInvalid()) {
                <p class="text-[11px] text-rose-500 font-medium mt-1">
                  English article content in Markdown is required.
                </p>
              }
            </div>

            <!-- Khmer Markdown Tab -->
            <div [class.hidden]="activeContentLang() !== 'kh'">
              <app-markdown-editor
                label="Khmer Article Body (Optional)"
                placeholder="# សេចក្តីផ្តើម&#10;&#10;សរសេរអត្ថបទបច្ចេកទេសជាភាសាខ្មែរនៅទីនេះ..."
                [rows]="16"
                formControlName="kh"
              ></app-markdown-editor>
            </div>
          </div>
        </div>

        <!-- Form Action Controls -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            routerLink="/admin/blog"
            class="px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            [disabled]="isSubmitting()"
            class="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            @if (isSubmitting()) {
              <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Saving...</span>
            } @else {
              <span>{{ isEditMode() ? 'Update Article' : 'Create Article' }}</span>
            }
          </button>
        </div>
      </form>
    </div>
  `,
})
export class BlogFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly portfolioService = inject(PortfolioService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public readonly isEditMode = signal<boolean>(false);
  public readonly blogId = signal<string | null>(null);
  public readonly isSubmitting = signal<boolean>(false);
  public readonly isSubmitted = signal<boolean>(false);
  public readonly categories = signal<Category[]>([]);
  public readonly activeContentLang = signal<'en' | 'kh'>('en');

  public selectedCoverFile: File | null = null;
  public tagsList: string[] = [];
  public newTagInput = '';
  private userEditedSlug = false;

  public readonly blogForm: FormGroup = this.fb.group({
    title: [{ en: '', kh: '' }, Validators.required],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)]],
    excerpt: [{ en: '', kh: '' }, Validators.required],
    content: this.fb.group({
      en: ['', Validators.required],
      kh: [''],
    }),
    category: ['', Validators.required],
    coverImage: [''],
    status: ['draft', Validators.required],
    featured: [false],
    publishedAt: [null],
  });

  public ngOnInit(): void {
    this.loadCategories();

    // Listen to English title changes to auto-suggest slug in create mode
    this.blogForm.get('title')?.valueChanges.subscribe((val: { en?: string; kh?: string }) => {
      if (!this.isEditMode() && !this.userEditedSlug && val?.en) {
        this.blogForm.get('slug')?.setValue(this.slugify(val.en), { emitEvent: false });
      }
    });

    this.blogForm.get('slug')?.valueChanges.subscribe(() => {
      this.userEditedSlug = true;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.blogId.set(id);
      this.loadBlogPost(id);
    }
  }

  public loadCategories(): void {
    this.portfolioService.getCategories('blog').subscribe({
      next: (res) => {
        this.categories.set(res.data || []);
      },
      error: () => {
        this.portfolioService.getCategories().subscribe({
          next: (res) => this.categories.set(res.data || []),
          error: () => {
            /* ignore fallback category error */
          },
        });
      },
    });
  }

  public loadBlogPost(id: string): void {
    this.portfolioService.getAdminBlogPostById(id).subscribe({
      next: (res) => {
        const post = res.data;
        const catId = typeof post.category === 'object' && post.category !== null ? post.category._id : post.category;

        this.blogForm.patchValue({
          title: post.title || { en: '', kh: '' },
          slug: post.slug || '',
          excerpt: post.excerpt || { en: '', kh: '' },
          content: {
            en: post.content?.en || '',
            kh: post.content?.kh || '',
          },
          category: catId || '',
          coverImage: post.coverImage || '',
          status: post.status || 'draft',
          featured: !!post.featured,
          publishedAt: post.publishedAt || null,
        });

        this.tagsList = Array.isArray(post.tags) ? [...post.tags] : [];
        this.userEditedSlug = true;
      },
      error: () => {
        this.notificationService.showError('Failed to load article details.');
      },
    });
  }

  public slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  public autoGenerateSlug(): void {
    const titleVal = this.blogForm.get('title')?.value;
    const enTitle = titleVal?.en;
    if (enTitle) {
      this.blogForm.get('slug')?.setValue(this.slugify(enTitle));
    }
  }

  public onImageSelected(file: File): void {
    this.selectedCoverFile = file;
    if (!this.blogForm.get('coverImage')?.value) {
      this.blogForm.patchValue({ coverImage: 'file://' + file.name });
    }
  }

  public onImageRemoved(): void {
    this.selectedCoverFile = null;
    this.blogForm.patchValue({ coverImage: '' });
  }

  public addTag(): void {
    const tag = this.newTagInput.trim();
    if (tag && !this.tagsList.includes(tag)) {
      this.tagsList.push(tag);
    }
    this.newTagInput = '';
  }

  public removeTag(index: number): void {
    this.tagsList.splice(index, 1);
  }

  public isFieldInvalid(fieldName: string): boolean {
    const ctrl = this.blogForm.get(fieldName);
    if (!ctrl) return false;

    if (fieldName === 'title' || fieldName === 'excerpt') {
      const val = ctrl.value;
      const isMissingEn = !val || !val.en || !val.en.trim();
      return (ctrl.touched || this.isSubmitted()) && isMissingEn;
    }

    return ctrl.invalid && (ctrl.touched || this.isSubmitted());
  }

  public isContentEnInvalid(): boolean {
    const ctrl = this.blogForm.get('content.en');
    return !!ctrl && ctrl.invalid && (ctrl.touched || this.isSubmitted());
  }

  public onSubmit(): void {
    this.isSubmitted.set(true);

    const titleEn = this.blogForm.get('title')?.value?.en;
    const excerptEn = this.blogForm.get('excerpt')?.value?.en;
    const contentEn = this.blogForm.get('content.en')?.value;

    if (!titleEn?.trim()) {
      this.notificationService.showError('English article title is required.');
      return;
    }

    if (!excerptEn?.trim()) {
      this.notificationService.showError('English summary excerpt is required.');
      return;
    }

    if (!contentEn?.trim()) {
      this.notificationService.showError('English markdown content is required.');
      return;
    }

    if (this.blogForm.invalid) {
      this.notificationService.showError('Please check form fields for errors.');
      return;
    }

    this.isSubmitting.set(true);
    const formVal = this.blogForm.value;

    const payload: Partial<BlogPost> = {
      title: {
        en: formVal.title.en,
        kh: formVal.title.kh || formVal.title.en,
      },
      slug: formVal.slug,
      excerpt: {
        en: formVal.excerpt.en,
        kh: formVal.excerpt.kh || formVal.excerpt.en,
      },
      content: {
        en: formVal.content.en,
        kh: formVal.content.kh || formVal.content.en,
      },
      category: formVal.category,
      coverImage: formVal.coverImage || undefined,
      tags: this.tagsList,
      status: formVal.status as BlogPostStatus,
      featured: !!formVal.featured,
      publishedAt: formVal.publishedAt || (formVal.status === 'published' ? new Date().toISOString() : undefined),
    };

    if (this.isEditMode() && this.blogId()) {
      this.portfolioService.updateAdminBlogPost(this.blogId()!, payload).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.notificationService.showSuccess('Article updated successfully!');
          this.router.navigate(['/admin/blog']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.notificationService.showError(err?.error?.message || 'Failed to update article.');
        },
      });
    } else {
      this.portfolioService.createAdminBlogPost(payload).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.notificationService.showSuccess('Article created successfully!');
          this.router.navigate(['/admin/blog']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.notificationService.showError(err?.error?.message || 'Failed to create article.');
        },
      });
    }
  }
}
