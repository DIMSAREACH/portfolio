import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Education } from '../../../../core/models';
import { BilingualFieldComponent } from '../../shared';

@Component({
  selector: 'app-admin-education-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    BilingualFieldComponent,
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <!-- Breadcrumb & Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <a routerLink="/admin/education" class="hover:text-indigo-600 transition-colors">Education</a>
            <span>/</span>
            <span class="text-indigo-600 dark:text-indigo-400 font-bold">
              {{ isEditMode() ? 'Edit Degree' : 'New Degree' }}
            </span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">
            {{ isEditMode() ? 'Edit Academic Record' : 'Record Academic Degree' }}
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Document universities, undergraduate/postgraduate degrees, specialization fields, and graduation years.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a
            routerLink="/admin/education"
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
            <span>{{ isEditMode() ? 'Save Changes' : 'Create Record' }}</span>
          </button>
        </div>
      </div>

      <!-- Main Form -->
      <form [formGroup]="educationForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Section 1: Institution & Degree -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Academic Institution & Credential
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Institution (Bilingual) -->
            <div class="md:col-span-2">
              <app-bilingual-field
                label="Institution / University Name"
                [required]="true"
                placeholderEn="e.g. Royal University of Phnom Penh (RUPP)"
                placeholderKh="ឧ. សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ"
                formControlName="institution"
              ></app-bilingual-field>
              @if (isFieldInvalid('institution')) {
                <p class="text-[11px] text-rose-500 mt-1 font-medium">English institution name is required.</p>
              }
            </div>

            <!-- Degree (Bilingual) -->
            <div>
              <app-bilingual-field
                label="Degree / Qualification"
                [required]="true"
                placeholderEn="e.g. Bachelor of Science, Master of IT"
                placeholderKh="ឧ. បរិញ្ញាបត្រវិទ្យាសាស្ត្រ"
                formControlName="degree"
              ></app-bilingual-field>
              @if (isFieldInvalid('degree')) {
                <p class="text-[11px] text-rose-500 mt-1 font-medium">English degree title is required.</p>
              }
            </div>

            <!-- Field of Study (Bilingual) -->
            <div>
              <app-bilingual-field
                label="Field of Study / Major"
                [required]="true"
                placeholderEn="e.g. Computer Science, Software Engineering"
                placeholderKh="ឧ. វិទ្យាសាស្ត្រកុំព្យូទ័រ, វិស្វកម្មផ្នែកទន់"
                formControlName="field"
              ></app-bilingual-field>
              @if (isFieldInvalid('field')) {
                <p class="text-[11px] text-rose-500 mt-1 font-medium">English field of study is required.</p>
              }
            </div>
          </div>
        </div>

        <!-- Section 2: Study Years & GPA -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Academic Timeline & Performance
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <!-- Start Year -->
            <div>
              <label for="education-start-year" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Start Year <span class="text-rose-500 font-bold">*</span>
              </label>
              <input
                id="education-start-year"
                type="number"
                formControlName="startYear"
                placeholder="2020"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
              />
              @if (isFieldInvalid('startYear')) {
                <p class="text-[11px] text-rose-500 mt-1 font-medium">Valid start year is required.</p>
              }
            </div>

            <!-- End Year -->
            <div>
              <label for="education-end-year" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                End Year (Leave blank if ongoing)
              </label>
              <input
                id="education-end-year"
                type="number"
                formControlName="endYear"
                placeholder="2024"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
              />
            </div>

            <!-- GPA / Honors -->
            <div>
              <label for="education-gpa" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                GPA / Honors (Optional)
              </label>
              <input
                id="education-gpa"
                type="text"
                formControlName="gpa"
                placeholder="e.g. 3.8 / 4.0 or Summa Cum Laude"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        <!-- Section 3: Description & Order -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Academic Highlights & Priority
          </h2>

          <!-- Description (Bilingual) -->
          <div>
            <app-bilingual-field
              label="Academic Highlights / Thesis / Coursework"
              fieldType="textarea"
              placeholderEn="Specialized in distributed systems and database architectures..."
              placeholderKh="ជំនាញលើប្រព័ន្ធចែកចាយ និងស្ថាបត្យកម្មមូលដ្ឋានទិន្នន័យ..."
              formControlName="description"
              [rows]="3"
            ></app-bilingual-field>
          </div>

          <!-- Order -->
          <div class="w-full sm:w-1/3">
            <label for="education-order" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Display Order Priority
            </label>
            <input
              id="education-order"
              type="number"
              formControlName="order"
              class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
            />
          </div>
        </div>

        <!-- Bottom Action Bar -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <a
            routerLink="/admin/education"
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
            <span>{{ isEditMode() ? 'Save Changes' : 'Create Record' }}</span>
          </button>
        </div>
      </form>
    </div>
  `,
})
export class EducationFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly portfolioService = inject(PortfolioService);
  private readonly notificationService = inject(NotificationService);

  public readonly isEditMode = signal<boolean>(false);
  public readonly educationId = signal<string | null>(null);
  public readonly isSubmitting = signal<boolean>(false);
  public readonly isSubmitted = signal<boolean>(false);

  public educationForm: FormGroup = this.fb.group({
    institution: [{ en: '', kh: '' }, Validators.required],
    degree: [{ en: '', kh: '' }, Validators.required],
    field: [{ en: '', kh: '' }, Validators.required],
    startYear: [new Date().getFullYear() - 4, [Validators.required, Validators.min(1900)]],
    endYear: [null],
    gpa: [''],
    description: [{ en: '', kh: '' }],
    order: [0],
  });

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.educationId.set(id);
      this.loadEducation(id);
    }
  }

  public loadEducation(id: string): void {
    this.portfolioService.getAdminEducationById(id).subscribe({
      next: (res) => {
        const edu = res.data;
        this.educationForm.patchValue({
          institution: edu.institution || { en: '', kh: '' },
          degree: edu.degree || { en: '', kh: '' },
          field: edu.field || { en: '', kh: '' },
          startYear: edu.startYear,
          endYear: edu.endYear ?? null,
          gpa: edu.gpa || '',
          description: edu.description || { en: '', kh: '' },
          order: edu.order ?? 0,
        });
      },
      error: () => {
        this.notificationService.showError('Failed to load education details.');
      },
    });
  }

  public isFieldInvalid(fieldName: string): boolean {
    const ctrl = this.educationForm.get(fieldName);
    if (!ctrl) return false;

    if (fieldName === 'institution' || fieldName === 'degree' || fieldName === 'field') {
      const val = ctrl.value;
      const isMissingEn = !val || !val.en || !val.en.trim();
      return (ctrl.touched || this.isSubmitted()) && isMissingEn;
    }

    return ctrl.invalid && (ctrl.touched || this.isSubmitted());
  }

  public onSubmit(): void {
    this.isSubmitted.set(true);

    const instVal = this.educationForm.get('institution')?.value;
    const degVal = this.educationForm.get('degree')?.value;
    const fldVal = this.educationForm.get('field')?.value;

    if (!instVal?.en?.trim()) {
      this.notificationService.showError('English institution name is required.');
      return;
    }

    if (!degVal?.en?.trim()) {
      this.notificationService.showError('English degree title is required.');
      return;
    }

    if (!fldVal?.en?.trim()) {
      this.notificationService.showError('English field of study is required.');
      return;
    }

    if (this.educationForm.invalid) {
      this.notificationService.showError('Please fix form validation errors.');
      return;
    }

    this.isSubmitting.set(true);
    const formVal = this.educationForm.value;

    const payload: Partial<Education> = {
      ...formVal,
      startYear: Number(formVal.startYear),
      endYear: formVal.endYear ? Number(formVal.endYear) : undefined,
    };

    if (this.isEditMode() && this.educationId()) {
      this.portfolioService.updateAdminEducation(this.educationId()!, payload).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.notificationService.showSuccess('Education record updated successfully!');
          this.router.navigate(['/admin/education']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.notificationService.showError(err?.error?.message || 'Failed to update education record.');
        },
      });
    } else {
      this.portfolioService.createAdminEducation(payload).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.notificationService.showSuccess('Education record created successfully!');
          this.router.navigate(['/admin/education']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.notificationService.showError(err?.error?.message || 'Failed to create education record.');
        },
      });
    }
  }
}
