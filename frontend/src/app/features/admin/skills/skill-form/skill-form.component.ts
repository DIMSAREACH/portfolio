import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Skill } from '../../../../core/models';
import { BilingualFieldComponent } from '../../shared';

interface CategoryPreset {
  label: string;
  en: string;
  kh: string;
}

@Component({
  selector: 'app-admin-skill-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    BilingualFieldComponent,
  ],
  template: `
    <div class="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      <!-- Breadcrumb & Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <a routerLink="/admin/skills" class="hover:text-indigo-600 transition-colors">Skills</a>
            <span>/</span>
            <span class="text-indigo-600 dark:text-indigo-400 font-bold">
              {{ isEditMode() ? 'Edit Skill' : 'New Skill' }}
            </span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">
            {{ isEditMode() ? 'Edit Skill Definition' : 'Add New Skill' }}
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Define technical proficiencies, bilingual category designations, icon identifiers, and visibility status.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a
            routerLink="/admin/skills"
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
            <span>{{ isEditMode() ? 'Save Changes' : 'Create Skill' }}</span>
          </button>
        </div>
      </div>

      <!-- Main Form Card -->
      <form [formGroup]="skillForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Skill Properties
          </h2>

          <!-- Skill Name -->
          <div>
            <label for="skill-name-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Skill Name <span class="text-rose-500 font-bold">*</span>
            </label>
            <input
              id="skill-name-input"
              type="text"
              formControlName="name"
              placeholder="e.g. Angular, Node.js, TypeScript, PostgreSQL"
              class="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            />
            @if (isFieldInvalid('name')) {
              <p class="text-[11px] text-rose-500 mt-1 font-medium">Skill name is required.</p>
            }
          </div>

          <!-- Bilingual Category -->
          <div class="space-y-3">
            <app-bilingual-field
              label="Category"
              [required]="true"
              placeholderEn="e.g. Frontend, Backend, Cloud & DevOps"
              placeholderKh="ឧ. ផ្នែកខាងមុខ, ផ្នែកខាងក្រោយ, ពពក និងដេវអបស៍"
              formControlName="category"
            ></app-bilingual-field>
            @if (isFieldInvalid('category')) {
              <p class="text-[11px] text-rose-500 mt-1 font-medium">English category name is required.</p>
            }

            <!-- Quick Presets -->
            <div>
              <p class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                Quick Category Suggestions:
              </p>
              <div class="flex flex-wrap gap-2">
                @for (preset of categoryPresets; track preset.en) {
                  <button
                    type="button"
                    (click)="applyPreset(preset)"
                    class="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 transition-colors"
                  >
                    {{ preset.label }}
                  </button>
                }
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <!-- Icon Input & Preview -->
            <div>
              <label for="skill-icon-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Icon Identifier / URL (Optional)
              </label>
              <div class="flex items-center gap-3">
                <input
                  id="skill-icon-input"
                  type="text"
                  formControlName="icon"
                  placeholder="e.g. devicon-angularjs-plain, si-typescript, or https://..."
                  class="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                />
                @if (iconPreview()) {
                  <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 overflow-hidden">
                    @if (isIconUrl(iconPreview())) {
                      <img [src]="iconPreview()" alt="Skill icon preview" class="w-6 h-6 object-contain" />
                    } @else {
                      <i [class]="iconPreview() + ' text-xl'"></i>
                    }
                  </div>
                }
              </div>
              <p class="text-[10px] text-slate-400 mt-1">
                Supports Devicon CSS class name or absolute image URL.
              </p>
            </div>

            <!-- Display Order -->
            <div>
              <label for="skill-order-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Display Order Priority
              </label>
              <input
                id="skill-order-input"
                type="number"
                formControlName="order"
                class="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
              />
              <p class="text-[10px] text-slate-400 mt-1">
                Lower numbers appear first within category (e.g. 1 before 2).
              </p>
            </div>
          </div>

          <!-- Visibility Toggle -->
          <div class="pt-4 border-t border-slate-100 dark:border-slate-800">
            <label class="relative flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                formControlName="isVisible"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500/20 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
              <div>
                <span class="text-xs font-bold text-slate-900 dark:text-white">Public Visibility</span>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  When enabled, this skill is featured in your public portfolio and about sections.
                </p>
              </div>
            </label>
          </div>
        </div>

        <!-- Submit & Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <a
            routerLink="/admin/skills"
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
            <span>{{ isEditMode() ? 'Save Changes' : 'Create Skill' }}</span>
          </button>
        </div>
      </form>
    </div>
  `,
})
export class SkillFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly portfolioService = inject(PortfolioService);
  private readonly notificationService = inject(NotificationService);

  public readonly isEditMode = signal<boolean>(false);
  public readonly skillId = signal<string | null>(null);
  public readonly isSubmitting = signal<boolean>(false);
  public readonly isSubmitted = signal<boolean>(false);

  public readonly categoryPresets: CategoryPreset[] = [
    { label: 'Frontend', en: 'Frontend', kh: 'ផ្នែកខាងមុខ' },
    { label: 'Backend', en: 'Backend', kh: 'ផ្នែកខាងក្រោយ' },
    { label: 'Database', en: 'Database', kh: 'មូលដ្ឋានទិន្នន័យ' },
    { label: 'Cloud & DevOps', en: 'Cloud & DevOps', kh: 'ពពក និងដេវអបស៍' },
    { label: 'Mobile App', en: 'Mobile App', kh: 'កម្មវិធីទូរស័ព្ទ' },
    { label: 'Tools & Workflow', en: 'Tools & Workflow', kh: 'ឧបករណ៍ និងដំណើរការការងារ' },
  ];

  public skillForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    category: [{ en: '', kh: '' }, Validators.required],
    icon: [''],
    order: [0],
    isVisible: [true, Validators.required],
  });

  public get iconPreview(): () => string {
    return () => this.skillForm.get('icon')?.value || '';
  }

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.skillId.set(id);
      this.loadSkill(id);
    }
  }

  public loadSkill(id: string): void {
    this.portfolioService.getAdminSkillById(id).subscribe({
      next: (res) => {
        const s = res.data;
        this.skillForm.patchValue({
          name: s.name,
          category: s.category || { en: '', kh: '' },
          icon: s.icon || '',
          order: s.order ?? 0,
          isVisible: s.isVisible ?? true,
        });
      },
      error: () => {
        this.notificationService.showError('Failed to load skill details.');
      },
    });
  }

  public applyPreset(preset: CategoryPreset): void {
    this.skillForm.patchValue({
      category: { en: preset.en, kh: preset.kh },
    });
  }

  public isIconUrl(val: string): boolean {
    return /^https?:\/\//i.test(val) || val.startsWith('/') || val.startsWith('data:');
  }

  public isFieldInvalid(fieldName: string): boolean {
    const ctrl = this.skillForm.get(fieldName);
    if (!ctrl) return false;

    if (fieldName === 'category') {
      const val = ctrl.value;
      const isMissingEn = !val || !val.en || !val.en.trim();
      return (ctrl.touched || this.isSubmitted()) && isMissingEn;
    }

    return ctrl.invalid && (ctrl.touched || this.isSubmitted());
  }

  public onSubmit(): void {
    this.isSubmitted.set(true);

    const nameVal = this.skillForm.get('name')?.value;
    const catVal = this.skillForm.get('category')?.value;

    if (!nameVal || !nameVal.trim()) {
      this.notificationService.showError('Skill name is required.');
      return;
    }

    if (!catVal?.en?.trim()) {
      this.notificationService.showError('English category name is required.');
      return;
    }

    if (this.skillForm.invalid) {
      this.notificationService.showError('Please fix form validation errors.');
      return;
    }

    this.isSubmitting.set(true);
    const payload: Partial<Skill> = {
      ...this.skillForm.value,
      category: {
        en: catVal.en.trim(),
        kh: catVal.kh?.trim() || catVal.en.trim(),
      },
    };

    if (this.isEditMode() && this.skillId()) {
      this.portfolioService.updateAdminSkill(this.skillId()!, payload).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.notificationService.showSuccess('Skill updated successfully!');
          this.router.navigate(['/admin/skills']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.notificationService.showError(err?.error?.message || 'Failed to update skill.');
        },
      });
    } else {
      this.portfolioService.createAdminSkill(payload).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.notificationService.showSuccess('Skill created successfully!');
          this.router.navigate(['/admin/skills']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.notificationService.showError(err?.error?.message || 'Failed to create skill.');
        },
      });
    }
  }
}
