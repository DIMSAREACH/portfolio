import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Category, Project } from '../../../../core/models';
import {
  BilingualFieldComponent,
  ImageUploadComponent,
} from '../../shared';

@Component({
  selector: 'app-admin-project-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    BilingualFieldComponent,
    ImageUploadComponent,
  ],
  template: `
    <div class="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      <!-- Top Breadcrumb & Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <a routerLink="/admin/projects" class="hover:text-indigo-600 transition-colors">Projects</a>
            <span>/</span>
            <span class="text-indigo-600 dark:text-indigo-400 font-bold">
              {{ isEditMode() ? 'Edit Project' : 'New Project' }}
            </span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">
            {{ isEditMode() ? 'Edit Project Showcase' : 'Create New Project Showcase' }}
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Document comprehensive case studies with bilingual descriptions, tech stack tags, and rich markdown details.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a
            routerLink="/admin/projects"
            class="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all"
          >
            Cancel
          </a>
          <button
            type="button"
            (click)="onSubmit()"
            [disabled]="isSubmitting()"
            class="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50"
          >
            @if (isSubmitting()) {
              <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
            <span>{{ isEditMode() ? 'Save Changes' : 'Create Project' }}</span>
          </button>
        </div>
      </div>

      <!-- Main Form -->
      <form [formGroup]="projectForm" (ngSubmit)="onSubmit()" class="space-y-8">
        <!-- Section 1: Core Essentials & Metadata -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Core Information
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Project Title (Bilingual) -->
            <div class="md:col-span-2">
              <app-bilingual-field
                label="Project Title"
                [required]="true"
                placeholderEn="e.g. Enterprise Cloud Analytics Platform"
                placeholderKh="ឧ. វេទិកាវិភាគទិន្នន័យលើពពកសហគ្រាស"
                formControlName="title"
                (ngModelChange)="onTitleChange($event)"
              ></app-bilingual-field>
              @if (isFieldInvalid('title')) {
                <p class="text-[11px] text-rose-500 mt-1 font-medium">English title is required.</p>
              }
            </div>

            <!-- Slug (Auto-generated from EN title, editable) -->
            <div>
              <label for="project-slug-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                URL Slug <span class="text-rose-500 font-bold">*</span>
              </label>
              <input
                id="project-slug-input"
                type="text"
                formControlName="slug"
                placeholder="enterprise-cloud-analytics"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
              />
              @if (isFieldInvalid('slug')) {
                <p class="text-[11px] text-rose-500 mt-1 font-medium">URL slug is required.</p>
              }
            </div>

            <!-- Category -->
            <div>
              <label for="project-category-select" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category <span class="text-rose-500 font-bold">*</span>
              </label>
              <select
                id="project-category-select"
                formControlName="category"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="">Select a Category</option>
                @for (cat of categories(); track cat._id) {
                  <option [value]="cat._id">{{ cat.name.en }}</option>
                }
              </select>
              @if (isFieldInvalid('category')) {
                <p class="text-[11px] text-rose-500 mt-1 font-medium">Category is required.</p>
              }
            </div>

            <!-- Status -->
            <div>
              <label for="project-status-select" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Publication Status <span class="text-rose-500 font-bold">*</span>
              </label>
              <select
                id="project-status-select"
                formControlName="status"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="published">Published (Visible on public portfolio)</option>
                <option value="draft">Draft (Private admin only)</option>
              </select>
            </div>

            <!-- Display Order -->
            <div>
              <label for="project-order-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Display Order
              </label>
              <input
                id="project-order-input"
                type="number"
                formControlName="order"
                placeholder="1"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <!-- Featured Toggle -->
            <div class="flex items-center gap-3 pt-4">
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  formControlName="featured"
                  class="sr-only peer"
                />
                <div class="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                <span class="ml-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Feature on Home Showcase Hero
                </span>
              </label>
            </div>
          </div>

          <!-- Short Summary (Bilingual) -->
          <div class="pt-4 border-t border-slate-100 dark:border-slate-800">
            <app-bilingual-field
              label="Short Summary"
              [required]="true"
              fieldType="textarea"
              placeholderEn="A concise 2-sentence synopsis for the portfolio cards..."
              placeholderKh="សង្ខេបខ្លីពីរប្រយោគសម្រាប់កាតផលប័ត្រ..."
              formControlName="shortDescription"
            ></app-bilingual-field>
            @if (isFieldInvalid('shortDescription')) {
              <p class="text-[11px] text-rose-500 mt-1 font-medium">Short summary is required.</p>
            }
          </div>
        </div>

        <!-- Section 2: Media & Images -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Media & Visual Assets
          </h2>

          <div class="space-y-4">
            <!-- Main Cover Image -->
            <app-image-upload
              label="Project Main Cover Image"
              [required]="true"
              [value]="projectForm.get('mainImage')?.value"
              (fileSelected)="onMainImageSelected($event)"
              (imageRemoved)="onMainImageRemoved()"
            ></app-image-upload>
            @if (isFieldInvalid('mainImage')) {
              <p class="text-[11px] text-rose-500 font-medium">Cover image is required.</p>
            }

            <!-- Direct URL fallback for Main Image -->
            <div>
              <label for="project-main-image-url-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Or Direct Cover Image URL
              </label>
              <input
                id="project-main-image-url-input"
                type="url"
                formControlName="mainImage"
                placeholder="https://images.unsplash.com/photo-..."
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
              />
            </div>
          </div>
        </div>

        <!-- Section 3: Technology Stack Tags -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Technology Stack Tags
          </h2>

          <div>
            <div class="flex items-center gap-2">
              <input
                type="text"
                [(ngModel)]="newTagInput"
                [ngModelOptions]="{ standalone: true }"
                (keydown.enter)="addTechTag($event)"
                placeholder="Add technology tag (e.g. Angular, Node.js, Docker, MongoDB)..."
                class="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <button
                type="button"
                (click)="addTechTag($event)"
                class="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
              >
                Add Tag
              </button>
            </div>

            <!-- Current Tags Pill List -->
            <div class="flex flex-wrap items-center gap-2 mt-3 min-h-[2rem]">
              @for (tag of techTags(); track tag) {
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50">
                  <span>{{ tag }}</span>
                  <button
                    type="button"
                    (click)="removeTechTag(tag)"
                    class="hover:text-rose-500 font-bold ml-0.5 leading-none focus:outline-none"
                    aria-label="Remove tag"
                  >
                    &times;
                  </button>
                </span>
              } @empty {
                <span class="text-xs text-slate-400 italic">No technology tags added yet. Type a name and click "Add Tag".</span>
              }
            </div>
            @if (techTags().length === 0 && isSubmitted()) {
              <p class="text-[11px] text-rose-500 mt-1 font-medium">At least one technology tag is required.</p>
            }
          </div>
        </div>

        <!-- Section 4: External Links & Timeline Dates -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Project Links & Timeline
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label for="project-github-url-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                GitHub Repository URL
              </label>
              <input
                id="project-github-url-input"
                type="url"
                formControlName="githubUrl"
                placeholder="https://github.com/..."
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
              />
            </div>

            <div>
              <label for="project-live-url-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Live Deployment URL
              </label>
              <input
                id="project-live-url-input"
                type="url"
                formControlName="liveUrl"
                placeholder="https://myproject.dev"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
              />
            </div>

            <div>
              <label for="project-video-url-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Demo Video URL
              </label>
              <input
                id="project-video-url-input"
                type="url"
                formControlName="videoUrl"
                placeholder="https://youtube.com/watch?v=..."
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
              />
            </div>

            <div>
              <label for="project-start-date-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Start Date
              </label>
              <input
                id="project-start-date-input"
                type="date"
                formControlName="startDate"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label for="project-completion-date-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Completion Date
              </label>
              <input
                id="project-completion-date-input"
                type="date"
                formControlName="completionDate"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        <!-- Section 5: In-Depth Case Study (Markdown) -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            In-Depth Case Study (Markdown)
          </h2>

          <!-- Full Description (Bilingual Markdown) -->
          <div class="space-y-4">
            <app-bilingual-field
              label="Full Description Overview"
              [required]="true"
              fieldType="textarea"
              placeholderEn="Comprehensive architecture and technical overview..."
              placeholderKh="ទិដ្ឋភាពទូទៅនៃស្ថាបត្យកម្ម និងបច្ចេកទេស..."
              formControlName="fullDescription"
              [rows]="6"
            ></app-bilingual-field>
          </div>

          <!-- Problem Statement (Bilingual) -->
          <div class="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <app-bilingual-field
              label="Problem & Challenges Solved"
              fieldType="textarea"
              placeholderEn="What obstacles or business problems did this project address?..."
              placeholderKh="តើបញ្ហាប្រឈមអ្វីខ្លះដែលគម្រោងនេះបានដោះស្រាយ?..."
              formControlName="problem"
              [rows]="4"
            ></app-bilingual-field>
          </div>

          <!-- Solution & Architecture (Bilingual) -->
          <div class="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <app-bilingual-field
              label="Technical Solution & Architectural Design"
              fieldType="textarea"
              placeholderEn="How was the problem solved from an engineering perspective?..."
              placeholderKh="តើបញ្ហាត្រូវបានដោះស្រាយតាមរបៀបណាខាងវិស្វកម្ម?..."
              formControlName="solution"
              [rows]="4"
            ></app-bilingual-field>
          </div>
        </div>

        <!-- Bottom Submit / Action Bar -->
        <div class="flex items-center justify-end gap-3 pt-4">
          <a
            routerLink="/admin/projects"
            class="px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all"
          >
            Cancel
          </a>
          <button
            type="submit"
            [disabled]="isSubmitting()"
            class="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50"
          >
            @if (isSubmitting()) {
              <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
            <span>{{ isEditMode() ? 'Save Changes' : 'Create Project' }}</span>
          </button>
        </div>
      </form>
    </div>
  `,
})
export class ProjectFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly portfolioService = inject(PortfolioService);
  private readonly notificationService = inject(NotificationService);

  public readonly isEditMode = signal<boolean>(false);
  public readonly projectId = signal<string | null>(null);
  public readonly categories = signal<Category[]>([]);
  public readonly techTags = signal<string[]>([]);
  public readonly isSubmitting = signal<boolean>(false);
  public readonly isSubmitted = signal<boolean>(false);

  public newTagInput = '';
  public selectedImageFile: File | null = null;

  public projectForm: FormGroup = this.fb.group({
    title: [{ en: '', kh: '' }, Validators.required],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    category: ['', Validators.required],
    status: ['published', Validators.required],
    featured: [false],
    order: [0],
    shortDescription: [{ en: '', kh: '' }, Validators.required],
    mainImage: ['', Validators.required],
    githubUrl: [''],
    liveUrl: [''],
    videoUrl: [''],
    startDate: [''],
    completionDate: [''],
    fullDescription: [{ en: '', kh: '' }, Validators.required],
    problem: [{ en: '', kh: '' }],
    solution: [{ en: '', kh: '' }],
  });

  public ngOnInit(): void {
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.projectId.set(id);
      this.loadProject(id);
    }
  }

  public loadCategories(): void {
    this.portfolioService.getCategories('project').subscribe({
      next: (res) => {
        this.categories.set(res.data);
      },
      error: () => {
        this.notificationService.showError('Failed to load categories.');
      },
    });
  }

  public loadProject(id: string): void {
    this.portfolioService.getAdminProjectById(id).subscribe({
      next: (res) => {
        const p = res.data;
        const categoryId = typeof p.category === 'object' && p.category ? (p.category as Category)._id : p.category;

        this.projectForm.patchValue({
          title: p.title || { en: '', kh: '' },
          slug: p.slug,
          category: categoryId,
          status: p.status || 'published',
          featured: p.featured || false,
          order: p.order || 0,
          shortDescription: p.shortDescription || { en: '', kh: '' },
          mainImage: p.mainImage || '',
          githubUrl: p.githubUrl || '',
          liveUrl: p.liveUrl || '',
          videoUrl: p.videoUrl || '',
          startDate: p.startDate ? new Date(p.startDate).toISOString().substring(0, 10) : '',
          completionDate: p.completionDate ? new Date(p.completionDate).toISOString().substring(0, 10) : '',
          fullDescription: p.fullDescription || { en: '', kh: '' },
          problem: p.problem || { en: '', kh: '' },
          solution: p.solution || { en: '', kh: '' },
        });

        if (p.technologies && Array.isArray(p.technologies)) {
          this.techTags.set([...p.technologies]);
        }
      },
      error: () => {
        this.notificationService.showError('Failed to load project details.');
      },
    });
  }

  public onTitleChange(bilingualVal: { en?: string }): void {
    // Only auto-generate slug in create mode if user hasn't manually edited slug
    if (!this.isEditMode() && bilingualVal?.en) {
      const generated = this.slugify(bilingualVal.en);
      this.projectForm.patchValue({ slug: generated });
    }
  }

  public addTechTag(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    const clean = this.newTagInput.trim();
    if (clean && !this.techTags().includes(clean)) {
      this.techTags.update((tags) => [...tags, clean]);
      this.newTagInput = '';
    }
  }

  public removeTechTag(tagToRemove: string): void {
    this.techTags.update((tags) => tags.filter((t) => t !== tagToRemove));
  }

  public onMainImageSelected(file: File): void {
    this.selectedImageFile = file;
    // Set a placeholder or file name so the form control passes required check
    if (!this.projectForm.get('mainImage')?.value) {
      this.projectForm.patchValue({ mainImage: 'file://' + file.name });
    }
  }

  public onMainImageRemoved(): void {
    this.selectedImageFile = null;
    this.projectForm.patchValue({ mainImage: '' });
  }

  public isFieldInvalid(fieldName: string): boolean {
    const ctrl = this.projectForm.get(fieldName);
    if (!ctrl) return false;

    if (fieldName === 'title' || fieldName === 'shortDescription' || fieldName === 'fullDescription') {
      const val = ctrl.value;
      const isMissingEn = !val || !val.en || !val.en.trim();
      return (ctrl.touched || this.isSubmitted()) && isMissingEn;
    }

    return ctrl.invalid && (ctrl.touched || this.isSubmitted());
  }

  public onSubmit(): void {
    this.isSubmitted.set(true);

    // Validate title and descriptions has English
    const titleVal = this.projectForm.get('title')?.value;
    const shortDescVal = this.projectForm.get('shortDescription')?.value;
    const fullDescVal = this.projectForm.get('fullDescription')?.value;

    if (!titleVal?.en?.trim() || !shortDescVal?.en?.trim() || !fullDescVal?.en?.trim()) {
      this.notificationService.showError('Please fill in required English title and descriptions.');
      return;
    }

    if (this.techTags().length === 0) {
      this.notificationService.showError('Please add at least one technology tag.');
      return;
    }

    if (this.projectForm.invalid) {
      this.notificationService.showError('Please fix validation errors before submitting.');
      return;
    }

    this.isSubmitting.set(true);

    const payload: Partial<Project> = {
      ...this.projectForm.value,
      technologies: this.techTags(),
    };

    if (this.isEditMode() && this.projectId()) {
      this.portfolioService.updateAdminProject(this.projectId()!, payload).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.notificationService.showSuccess('Project updated successfully!');
          this.router.navigate(['/admin/projects']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.notificationService.showError(err?.error?.message || 'Failed to update project.');
        },
      });
    } else {
      this.portfolioService.createAdminProject(payload).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.notificationService.showSuccess('Project created successfully!');
          this.router.navigate(['/admin/projects']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.notificationService.showError(err?.error?.message || 'Failed to create project.');
        },
      });
    }
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
