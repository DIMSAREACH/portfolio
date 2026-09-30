import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Experience, ExperienceType } from '../../../../core/models';
import { BilingualFieldComponent } from '../../shared';

@Component({
  selector: 'app-admin-experience-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    BilingualFieldComponent,
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <!-- Top Breadcrumb & Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <a routerLink="/admin/experience" class="hover:text-indigo-600 transition-colors">Experience</a>
            <span>/</span>
            <span class="text-indigo-600 dark:text-indigo-400 font-bold">
              {{ isEditMode() ? 'Edit Role' : 'New Experience' }}
            </span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">
            {{ isEditMode() ? 'Edit Experience Milestone' : 'Record Career Milestone' }}
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Document professional positions, volunteer leadership, timelines, and applied technology stacks.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a
            routerLink="/admin/experience"
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
            <span>{{ isEditMode() ? 'Save Changes' : 'Create Entry' }}</span>
          </button>
        </div>
      </div>

      <!-- Main Form -->
      <form [formGroup]="experienceForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Section 1: Role & Organization -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Position & Organization
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Job Title (Bilingual) -->
            <div class="md:col-span-2">
              <app-bilingual-field
                label="Position / Role Title"
                [required]="true"
                placeholderEn="e.g. Lead Software Engineer, DevOps Architect"
                placeholderKh="ឧ. វិស្វករផ្នែកទន់ជាន់ខ្ពស់, ស្ថាបត្យករ DevOps"
                formControlName="title"
              ></app-bilingual-field>
              @if (isFieldInvalid('title')) {
                <p class="text-[11px] text-rose-500 mt-1 font-medium">English title is required.</p>
              }
            </div>

            <!-- Organization Name (Bilingual) -->
            <div>
              <app-bilingual-field
                label="Company / Organization"
                [required]="true"
                placeholderEn="e.g. Google Cloud, Tech Corp, NGO"
                placeholderKh="ឧ. ហ្គូហ្គល, ក្រុមហ៊ុនបច្ចេកវិទ្យា"
                formControlName="organization"
              ></app-bilingual-field>
              @if (isFieldInvalid('organization')) {
                <p class="text-[11px] text-rose-500 mt-1 font-medium">English organization name is required.</p>
              }
            </div>

            <!-- Location (Bilingual) -->
            <div>
              <app-bilingual-field
                label="Location (City, Country)"
                placeholderEn="e.g. Phnom Penh, Cambodia or Remote"
                placeholderKh="ឧ. រាជធានីភ្នំពេញ, កម្ពុជា ឬពីចម្ងាយ"
                formControlName="location"
              ></app-bilingual-field>
            </div>

            <!-- Engagement Type -->
            <div>
              <label for="experience-type-select" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Engagement Type <span class="text-rose-500 font-bold">*</span>
              </label>
              <select
                id="experience-type-select"
                formControlName="type"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              >
                <option value="work">Work (Full-time / Part-time Employment)</option>
                <option value="volunteer">Volunteer (Community & Civic)</option>
                <option value="internship">Internship (Apprenticeship)</option>
                <option value="freelance">Freelance (Contract & Consulting)</option>
              </select>
            </div>

            <!-- Display Order -->
            <div>
              <label for="experience-order-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Display Order Priority
              </label>
              <input
                id="experience-order-input"
                type="number"
                formControlName="order"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
              />
            </div>
          </div>
        </div>

        <!-- Section 2: Timeline Dates & Ongoing Status -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Timeline Period
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Start Date -->
            <div>
              <label for="experience-start-date" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Start Date <span class="text-rose-500 font-bold">*</span>
              </label>
              <input
                id="experience-start-date"
                type="date"
                formControlName="startDate"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
              />
              @if (isFieldInvalid('startDate')) {
                <p class="text-[11px] text-rose-500 mt-1 font-medium">Start date is required.</p>
              }
            </div>

            <!-- End Date -->
            <div>
              <label for="experience-end-date" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                End Date (Leave blank if currently working)
              </label>
              <input
                id="experience-end-date"
                type="date"
                formControlName="endDate"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>

            <!-- Currently Active / Ongoing Checkbox -->
            <div class="sm:col-span-2 pt-2">
              <label class="relative flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  formControlName="isCurrent"
                  (change)="onCurrentStatusToggle()"
                  class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30"
                />
                <span class="text-xs font-semibold text-slate-900 dark:text-white">
                  I currently work or serve in this position (Displays as "Present")
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Section 3: Overview Description & Technologies -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Role Summary & Tech Stack
          </h2>

          <!-- Description (Bilingual) -->
          <div>
            <app-bilingual-field
              label="Role Description / Key Achievements"
              fieldType="textarea"
              placeholderEn="Led a team of 6 engineers building cloud infrastructure, migrated services to Kubernetes..."
              placeholderKh="បានដឹកនាំក្រុមវិស្វករ ៦ នាក់ក្នុងការកសាងហេដ្ឋារចនាសម្ព័ន្ធពពក..."
              formControlName="description"
              [rows]="4"
            ></app-bilingual-field>
          </div>

          <!-- Technologies Tag Manager -->
          <div class="space-y-3 pt-2">
            <label for="experience-tech-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Technologies & Tools Used
            </label>
            <div class="flex items-center gap-2">
              <input
                id="experience-tech-input"
                type="text"
                [(ngModel)]="newTagInput"
                [ngModelOptions]="{ standalone: true }"
                (keydown.enter)="addTechTag($event)"
                placeholder="Type technology (e.g. Angular, AWS, Docker) and press Enter"
                class="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <button
                type="button"
                (click)="addTechTag()"
                class="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors shrink-0"
              >
                Add Tag
              </button>
            </div>

            <!-- Tag Chips -->
            <div class="flex flex-wrap gap-2 pt-1 min-h-[32px]">
              @for (tag of techTags(); track tag) {
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/50 animate-fadeIn">
                  <span>{{ tag }}</span>
                  <button
                    type="button"
                    (click)="removeTechTag(tag)"
                    class="text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200 focus:outline-none"
                    aria-label="Remove tag"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              }
              @if (techTags().length === 0) {
                <p class="text-xs text-slate-400 italic">No technology tags added yet.</p>
              }
            </div>
          </div>
        </div>

        <!-- Submit & Cancel Buttons -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <a
            routerLink="/admin/experience"
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
            <span>{{ isEditMode() ? 'Save Changes' : 'Create Entry' }}</span>
          </button>
        </div>
      </form>
    </div>
  `,
})
export class ExperienceFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly portfolioService = inject(PortfolioService);
  private readonly notificationService = inject(NotificationService);

  public readonly isEditMode = signal<boolean>(false);
  public readonly experienceId = signal<string | null>(null);
  public readonly isSubmitting = signal<boolean>(false);
  public readonly isSubmitted = signal<boolean>(false);
  public readonly techTags = signal<string[]>([]);

  public newTagInput = '';

  public experienceForm: FormGroup = this.fb.group({
    title: [{ en: '', kh: '' }, Validators.required],
    organization: [{ en: '', kh: '' }, Validators.required],
    location: [{ en: '', kh: '' }],
    type: ['work' as ExperienceType, Validators.required],
    startDate: ['', Validators.required],
    endDate: [''],
    isCurrent: [false],
    description: [{ en: '', kh: '' }],
    order: [0],
  });

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.experienceId.set(id);
      this.loadExperience(id);
    }
  }

  public loadExperience(id: string): void {
    this.portfolioService.getAdminExperienceById(id).subscribe({
      next: (res) => {
        const e = res.data;
        this.experienceForm.patchValue({
          title: e.title || { en: '', kh: '' },
          organization: e.organization || { en: '', kh: '' },
          location: e.location || { en: '', kh: '' },
          type: e.type || 'work',
          startDate: e.startDate ? new Date(e.startDate).toISOString().substring(0, 10) : '',
          endDate: e.endDate ? new Date(e.endDate).toISOString().substring(0, 10) : '',
          isCurrent: e.isCurrent ?? false,
          description: e.description || { en: '', kh: '' },
          order: e.order ?? 0,
        });

        if (e.isCurrent) {
          this.experienceForm.get('endDate')?.disable();
        } else {
          this.experienceForm.get('endDate')?.enable();
        }

        if (e.technologies && Array.isArray(e.technologies)) {
          this.techTags.set([...e.technologies]);
        }
      },
      error: () => {
        this.notificationService.showError('Failed to load experience details.');
      },
    });
  }

  public onCurrentStatusToggle(): void {
    const isCurrent = this.experienceForm.get('isCurrent')?.value;
    const endCtrl = this.experienceForm.get('endDate');
    if (isCurrent) {
      endCtrl?.setValue('');
      endCtrl?.disable();
    } else {
      endCtrl?.enable();
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

  public isFieldInvalid(fieldName: string): boolean {
    const ctrl = this.experienceForm.get(fieldName);
    if (!ctrl) return false;

    if (fieldName === 'title' || fieldName === 'organization') {
      const val = ctrl.value;
      const isMissingEn = !val || !val.en || !val.en.trim();
      return (ctrl.touched || this.isSubmitted()) && isMissingEn;
    }

    return ctrl.invalid && (ctrl.touched || this.isSubmitted());
  }

  public onSubmit(): void {
    this.isSubmitted.set(true);

    const titleVal = this.experienceForm.get('title')?.value;
    const orgVal = this.experienceForm.get('organization')?.value;

    if (!titleVal?.en?.trim()) {
      this.notificationService.showError('English position title is required.');
      return;
    }

    if (!orgVal?.en?.trim()) {
      this.notificationService.showError('English organization name is required.');
      return;
    }

    if (this.experienceForm.invalid) {
      this.notificationService.showError('Please fix form validation errors.');
      return;
    }

    this.isSubmitting.set(true);
    const formVal = this.experienceForm.value;

    const payload: Partial<Experience> = {
      ...formVal,
      technologies: this.techTags(),
      endDate: formVal.isCurrent ? undefined : formVal.endDate || undefined,
    };

    if (this.isEditMode() && this.experienceId()) {
      this.portfolioService.updateAdminExperience(this.experienceId()!, payload).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.notificationService.showSuccess('Experience updated successfully!');
          this.router.navigate(['/admin/experience']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.notificationService.showError(err?.error?.message || 'Failed to update experience.');
        },
      });
    } else {
      this.portfolioService.createAdminExperience(payload).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.notificationService.showSuccess('Experience created successfully!');
          this.router.navigate(['/admin/experience']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.notificationService.showError(err?.error?.message || 'Failed to create experience.');
        },
      });
    }
  }
}
