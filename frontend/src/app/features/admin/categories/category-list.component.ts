import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Category, CategoryType } from '../../../core/models';
import { BilingualFieldComponent } from '../shared';
import { ConfirmDialogComponent } from '../../../shared';

@Component({
  selector: 'app-admin-category-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, BilingualFieldComponent],
  template: `
    <div class="space-y-6 animate-fadeIn pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Taxonomy Management
            </span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Categories & Taxonomies
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Organize classification tags for portfolio case studies and blog articles.
          </p>
        </div>

        <button
          type="button"
          (click)="openCreateModal()"
          class="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 self-start sm:self-auto"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>New Category</span>
        </button>
      </div>

      <!-- Categories Grid / Table View -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <!-- Search and Filter Bar -->
        <div class="p-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="relative w-full sm:w-72">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Filter categories..."
              class="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Type filter buttons -->
          <div class="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              type="button"
              (click)="typeFilter.set('all')"
              class="px-3 py-1.5 text-xs font-semibold rounded-xl transition-all"
              [class.bg-indigo-600]="typeFilter() === 'all'"
              [class.text-white]="typeFilter() === 'all'"
              [class.bg-slate-100]="typeFilter() !== 'all'"
              [class.dark:bg-slate-800]="typeFilter() !== 'all'"
              [class.text-slate-600]="typeFilter() !== 'all'"
              [class.dark:text-slate-300]="typeFilter() !== 'all'"
            >
              All Types
            </button>
            <button
              type="button"
              (click)="typeFilter.set('project')"
              class="px-3 py-1.5 text-xs font-semibold rounded-xl transition-all"
              [class.bg-indigo-600]="typeFilter() === 'project'"
              [class.text-white]="typeFilter() === 'project'"
              [class.bg-slate-100]="typeFilter() !== 'project'"
              [class.dark:bg-slate-800]="typeFilter() !== 'project'"
              [class.text-slate-600]="typeFilter() !== 'project'"
              [class.dark:text-slate-300]="typeFilter() !== 'project'"
            >
              Projects
            </button>
            <button
              type="button"
              (click)="typeFilter.set('blog')"
              class="px-3 py-1.5 text-xs font-semibold rounded-xl transition-all"
              [class.bg-indigo-600]="typeFilter() === 'blog'"
              [class.text-white]="typeFilter() === 'blog'"
              [class.bg-slate-100]="typeFilter() !== 'blog'"
              [class.dark:bg-slate-800]="typeFilter() !== 'blog'"
              [class.text-slate-600]="typeFilter() !== 'blog'"
              [class.dark:text-slate-300]="typeFilter() !== 'blog'"
            >
              Blog
            </button>
            <button
              type="button"
              (click)="typeFilter.set('both')"
              class="px-3 py-1.5 text-xs font-semibold rounded-xl transition-all"
              [class.bg-indigo-600]="typeFilter() === 'both'"
              [class.text-white]="typeFilter() === 'both'"
              [class.bg-slate-100]="typeFilter() !== 'both'"
              [class.dark:bg-slate-800]="typeFilter() !== 'both'"
              [class.text-slate-600]="typeFilter() !== 'both'"
              [class.dark:text-slate-300]="typeFilter() !== 'both'"
            >
              Both
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse" aria-label="Categories Table">
            <thead>
              <tr class="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th scope="col" class="px-6 py-3.5">Name (English & Khmer)</th>
                <th scope="col" class="px-6 py-3.5">Slug</th>
                <th scope="col" class="px-6 py-3.5 text-center">Type</th>
                <th scope="col" class="px-6 py-3.5 text-center">Order</th>
                <th scope="col" class="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              @if (isLoading()) {
                @for (_ of [1, 2, 3]; track $index) {
                  <tr class="animate-pulse">
                    <td class="px-6 py-4"><div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48"></div></td>
                    <td class="px-6 py-4"><div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div></td>
                    <td class="px-6 py-4 text-center"><div class="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-16 mx-auto"></div></td>
                    <td class="px-6 py-4 text-center"><div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-8 mx-auto"></div></td>
                    <td class="px-6 py-4 text-right"><div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 ml-auto"></div></td>
                  </tr>
                }
              } @else if (filteredCategories().length === 0) {
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center text-slate-400">
                    No categories found. Click "New Category" to create one.
                  </td>
                </tr>
              } @else {
                @for (cat of filteredCategories(); track cat._id) {
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="px-6 py-4">
                      <div class="font-semibold text-slate-900 dark:text-white">{{ cat.name.en }}</div>
                      @if (cat.name.kh) {
                        <div class="text-[11px] text-slate-400">{{ cat.name.kh }}</div>
                      }
                      @if (cat.description?.en) {
                        <div class="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{{ cat.description?.en }}</div>
                      }
                    </td>
                    <td class="px-6 py-4 font-mono text-slate-600 dark:text-slate-400">
                      {{ cat.slug }}
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span
                        class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                        [class.bg-sky-50]="cat.type === 'project'"
                        [class.text-sky-700]="cat.type === 'project'"
                        [class.border-sky-200]="cat.type === 'project'"
                        [class.dark:bg-sky-950/60]="cat.type === 'project'"
                        [class.dark:text-sky-300]="cat.type === 'project'"
                        [class.bg-purple-50]="cat.type === 'blog'"
                        [class.text-purple-700]="cat.type === 'blog'"
                        [class.border-purple-200]="cat.type === 'blog'"
                        [class.dark:bg-purple-950/60]="cat.type === 'blog'"
                        [class.dark:text-purple-300]="cat.type === 'blog'"
                        [class.bg-emerald-50]="cat.type === 'both'"
                        [class.text-emerald-700]="cat.type === 'both'"
                        [class.border-emerald-200]="cat.type === 'both'"
                        [class.dark:bg-emerald-950/60]="cat.type === 'both'"
                        [class.dark:text-emerald-300]="cat.type === 'both'"
                      >
                        {{ cat.type }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-center text-slate-600 dark:text-slate-400 font-mono">
                      {{ cat.order ?? '-' }}
                    </td>
                    <td class="px-6 py-4 text-right whitespace-nowrap">
                      <div class="inline-flex items-center gap-1">
                        <button
                          type="button"
                          (click)="openEditModal(cat)"
                          class="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
                          title="Edit"
                          aria-label="Edit category"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          (click)="onDeleteCategory(cat)"
                          class="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                          title="Delete"
                          aria-label="Delete category"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Inline Create/Edit Modal Dialog -->
      @if (showModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 class="text-lg font-black text-slate-900 dark:text-white">
                {{ editingCategoryId ? 'Edit Category' : 'Create New Category' }}
              </h2>
              <button
                type="button"
                (click)="closeModal()"
                class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <form [formGroup]="categoryForm" (ngSubmit)="saveCategory()" class="space-y-4">
              <!-- Name (Bilingual) -->
              <app-bilingual-field
                label="Category Name"
                [required]="true"
                placeholderEn="e.g. Cloud Computing"
                placeholderKh="e.g. បច្ចេកវិទ្យាពពក"
                formControlName="name"
              ></app-bilingual-field>

              <!-- Slug -->
              <div class="space-y-1">
                <label for="cat-slug-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  URL Slug <span class="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <input
                  id="cat-slug-input"
                  type="text"
                  formControlName="slug"
                  placeholder="cloud-computing"
                  class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <!-- Type -->
              <div class="space-y-1">
                <label for="cat-type-select" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Category Type <span class="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <select
                  id="cat-type-select"
                  formControlName="type"
                  class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  <option value="project">Projects Only</option>
                  <option value="blog">Blog Articles Only</option>
                  <option value="both">Both Projects & Blog</option>
                </select>
              </div>

              <!-- Description (Bilingual) -->
              <app-bilingual-field
                label="Description"
                fieldType="textarea"
                placeholderEn="Short description of this category..."
                placeholderKh="ការពិពណ៌នាខ្លី..."
                formControlName="description"
                [rows]="2"
              ></app-bilingual-field>

              <!-- Order -->
              <div class="space-y-1">
                <label for="cat-order-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Display Order
                </label>
                <input
                  id="cat-order-input"
                  type="number"
                  formControlName="order"
                  placeholder="0"
                  class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  (click)="closeModal()"
                  class="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="isSaving()"
                  class="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow transition-all disabled:opacity-50"
                >
                  {{ isSaving() ? 'Saving...' : (editingCategoryId ? 'Save Changes' : 'Create Category') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class CategoryListComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  public readonly categories = signal<Category[]>([]);
  public readonly isLoading = signal<boolean>(true);
  public readonly isSaving = signal<boolean>(false);
  public readonly showModal = signal<boolean>(false);
  public readonly typeFilter = signal<string>('all');

  public searchQuery = '';
  public editingCategoryId: string | null = null;

  public readonly categoryForm: FormGroup = this.fb.group({
    name: [{ en: '', kh: '' }, Validators.required],
    slug: ['', Validators.required],
    type: ['project' as CategoryType, Validators.required],
    description: [{ en: '', kh: '' }],
    order: [0],
  });

  public ngOnInit(): void {
    this.loadCategories();

    this.categoryForm.get('name')?.valueChanges.subscribe((val: { en?: string }) => {
      if (!this.editingCategoryId && val?.en) {
        this.categoryForm.get('slug')?.setValue(this.slugify(val.en), { emitEvent: false });
      }
    });
  }

  public loadCategories(): void {
    this.isLoading.set(true);
    this.portfolioService.getAdminCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notificationService.showError('Failed to load categories.');
      },
    });
  }

  public filteredCategories(): Category[] {
    let list = this.categories();

    if (this.typeFilter() !== 'all') {
      list = list.filter((c) => c.type === this.typeFilter());
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.en.toLowerCase().includes(q) ||
          c.name.kh.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q),
      );
    }

    return list;
  }

  public openCreateModal(): void {
    this.editingCategoryId = null;
    this.categoryForm.reset({
      name: { en: '', kh: '' },
      slug: '',
      type: 'project',
      description: { en: '', kh: '' },
      order: 0,
    });
    this.showModal.set(true);
  }

  public openEditModal(cat: Category): void {
    this.editingCategoryId = cat._id;
    this.categoryForm.patchValue({
      name: cat.name,
      slug: cat.slug,
      type: cat.type,
      description: cat.description || { en: '', kh: '' },
      order: cat.order ?? 0,
    });
    this.showModal.set(true);
  }

  public closeModal(): void {
    this.showModal.set(false);
    this.editingCategoryId = null;
  }

  public saveCategory(): void {
    const nameVal = this.categoryForm.get('name')?.value;
    if (!nameVal?.en?.trim()) {
      this.notificationService.showError('English category name is required.');
      return;
    }

    if (this.categoryForm.invalid) {
      this.notificationService.showError('Please check form fields for errors.');
      return;
    }

    this.isSaving.set(true);
    const formVal = this.categoryForm.value;

    const payload: Partial<Category> = {
      name: {
        en: formVal.name.en,
        kh: formVal.name.kh || formVal.name.en,
      },
      slug: formVal.slug,
      type: formVal.type,
      description: formVal.description,
      order: Number(formVal.order) || 0,
    };

    if (this.editingCategoryId) {
      this.portfolioService.updateAdminCategory(this.editingCategoryId, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.notificationService.showSuccess('Category updated successfully!');
          this.loadCategories();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.notificationService.showError(err?.error?.message || 'Failed to update category.');
        },
      });
    } else {
      this.portfolioService.createAdminCategory(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.notificationService.showSuccess('Category created successfully!');
          this.loadCategories();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.notificationService.showError(err?.error?.message || 'Failed to create category.');
        },
      });
    }
  }

  public onDeleteCategory(cat: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Category',
        message: `Are you sure you want to delete category "${cat.name.en}"? It must not be referenced by projects or articles.`,
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.portfolioService.deleteAdminCategory(cat._id).subscribe({
          next: () => {
            this.notificationService.showSuccess('Category deleted successfully.');
            this.loadCategories();
          },
          error: (err) => {
            this.notificationService.showError(err?.error?.message || 'Failed to delete category.');
          },
        });
      }
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
}
