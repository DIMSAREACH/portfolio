import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Certification, CertificationType } from '../../../../core/models';
import { BilingualFieldComponent, ImageUploadComponent } from '../../shared';

@Component({
  selector: 'app-admin-certification-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    BilingualFieldComponent,
    ImageUploadComponent,
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <!-- Top Breadcrumb & Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <a routerLink="/admin/certifications" class="hover:text-indigo-600 transition-colors">Certifications</a>
            <span>/</span>
            <span class="text-indigo-600 dark:text-indigo-400 font-bold">
              {{ isEditMode() ? 'Edit Credential' : 'New Credential' }}
            </span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white">
            {{ isEditMode() ? 'Edit Professional Credential' : 'Add Professional Credential' }}
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Record certifications, professional badges, hackathon honors, and verification URLs.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a
            routerLink="/admin/certifications"
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
            <span>{{ isEditMode() ? 'Save Changes' : 'Create Credential' }}</span>
          </button>
        </div>
      </div>

      <!-- Main Form -->
      <form [formGroup]="certForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Section 1: Name, Organization & Type -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Credential Details
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Credential Name (Bilingual) -->
            <div class="md:col-span-2">
              <app-bilingual-field
                label="Certification / Award Name"
                [required]="true"
                placeholderEn="e.g. AWS Certified Solutions Architect - Associate"
                placeholderKh="ឧ. ស្ថាបត្យករដំណោះស្រាយដែលមានវិញ្ញាបនបត្រ AWS"
                formControlName="name"
              ></app-bilingual-field>
              @if (isFieldInvalid('name')) {
                <p class="text-[11px] text-rose-500 mt-1 font-medium">English credential name is required.</p>
              }
            </div>

            <!-- Issuing Body (Bilingual) -->
            <div>
              <app-bilingual-field
                label="Issuing Organization"
                [required]="true"
                placeholderEn="e.g. Amazon Web Services, Google Cloud, Microsoft"
                placeholderKh="ឧ. សេវាកម្មគេហទំព័រ Amazon, ហ្គូហ្គលពពក"
                formControlName="organization"
              ></app-bilingual-field>
              @if (isFieldInvalid('organization')) {
                <p class="text-[11px] text-rose-500 mt-1 font-medium">English issuing organization is required.</p>
              }
            </div>

            <!-- Type -->
            <div>
              <label for="cert-type-select" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Credential Category <span class="text-rose-500 font-bold">*</span>
              </label>
              <select
                id="cert-type-select"
                formControlName="type"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              >
                <option value="certification">Professional Certification</option>
                <option value="award">Honor / Competition Award</option>
                <option value="achievement">Key Milestone / Achievement</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Section 2: Dates & Verification -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Validity & Verification
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Issue Date -->
            <div>
              <label for="cert-issue-date" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Issue Date <span class="text-rose-500 font-bold">*</span>
              </label>
              <input
                id="cert-issue-date"
                type="date"
                formControlName="issueDate"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
              />
              @if (isFieldInvalid('issueDate')) {
                <p class="text-[11px] text-rose-500 mt-1 font-medium">Issue date is required.</p>
              }
            </div>

            <!-- Expiration Date -->
            <div>
              <label for="cert-exp-date" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Expiration Date (Leave blank if lifetime/no expiry)
              </label>
              <input
                id="cert-exp-date"
                type="date"
                formControlName="expirationDate"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
              />
            </div>

            <!-- Credential ID -->
            <div>
              <label for="cert-credential-id" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Credential ID / License Number
              </label>
              <input
                id="cert-credential-id"
                type="text"
                formControlName="credentialId"
                placeholder="e.g. AWS-SAA-123456"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
              />
            </div>

            <!-- Credential URL -->
            <div>
              <label for="cert-credential-url" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Verification URL
              </label>
              <input
                id="cert-credential-url"
                type="url"
                formControlName="credentialUrl"
                placeholder="https://credly.com/badges/..."
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
              />
            </div>
          </div>
        </div>

        <!-- Section 3: Badge Image & Description -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Badge Media & Description
          </h2>

          <!-- Badge Image Upload -->
          <div>
            <app-image-upload
              label="Certificate or Badge Image"
              helperText="Recommended square PNG badge or certificate screenshot."
              [value]="certForm.get('image')?.value"
              (fileSelected)="onImageSelected($event)"
              (imageRemoved)="onImageRemoved()"
            ></app-image-upload>
          </div>

          <!-- Description (Bilingual) -->
          <div>
            <app-bilingual-field
              label="Summary Description"
              fieldType="textarea"
              placeholderEn="Demonstrates proficiency in multi-region architectural resiliency, IAM security..."
              placeholderKh="បង្ហាញពីសមត្ថភាពក្នុងការរចនាស្ថាបត្យកម្មពពក..."
              formControlName="description"
              [rows]="3"
            ></app-bilingual-field>
          </div>

          <!-- Order & Visibility -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label for="cert-order" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Display Order Priority
              </label>
              <input
                id="cert-order"
                type="number"
                formControlName="order"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
              />
            </div>

            <div class="flex items-center pt-5">
              <label class="relative flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  formControlName="isVisible"
                  class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30"
                />
                <span class="text-xs font-semibold text-slate-900 dark:text-white">
                  Show on public portfolio achievements page
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Submit & Cancel Buttons -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <a
            routerLink="/admin/certifications"
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
            <span>{{ isEditMode() ? 'Save Changes' : 'Create Credential' }}</span>
          </button>
        </div>
      </form>
    </div>
  `,
})
export class CertificationFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly portfolioService = inject(PortfolioService);
  private readonly notificationService = inject(NotificationService);

  public readonly isEditMode = signal<boolean>(false);
  public readonly certId = signal<string | null>(null);
  public readonly isSubmitting = signal<boolean>(false);
  public readonly isSubmitted = signal<boolean>(false);

  public selectedImageFile: File | null = null;

  public certForm: FormGroup = this.fb.group({
    name: [{ en: '', kh: '' }, Validators.required],
    organization: [{ en: '', kh: '' }, Validators.required],
    type: ['certification' as CertificationType, Validators.required],
    issueDate: ['', Validators.required],
    expirationDate: [''],
    credentialId: [''],
    credentialUrl: [''],
    image: [''],
    description: [{ en: '', kh: '' }],
    isVisible: [true, Validators.required],
    order: [0],
  });

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.certId.set(id);
      this.loadCertification(id);
    }
  }

  public loadCertification(id: string): void {
    this.portfolioService.getAdminCertificationById(id).subscribe({
      next: (res) => {
        const c = res.data;
        this.certForm.patchValue({
          name: c.name || { en: '', kh: '' },
          organization: c.organization || { en: '', kh: '' },
          type: c.type || 'certification',
          issueDate: c.issueDate ? new Date(c.issueDate).toISOString().substring(0, 10) : '',
          expirationDate: c.expirationDate ? new Date(c.expirationDate).toISOString().substring(0, 10) : '',
          credentialId: c.credentialId || '',
          credentialUrl: c.credentialUrl || '',
          image: c.image || '',
          description: c.description || { en: '', kh: '' },
          isVisible: c.isVisible ?? true,
          order: c.order ?? 0,
        });
      },
      error: () => {
        this.notificationService.showError('Failed to load certification details.');
      },
    });
  }

  public onImageSelected(file: File): void {
    this.selectedImageFile = file;
    if (!this.certForm.get('image')?.value) {
      this.certForm.patchValue({ image: 'file://' + file.name });
    }
  }

  public onImageRemoved(): void {
    this.selectedImageFile = null;
    this.certForm.patchValue({ image: '' });
  }

  public isFieldInvalid(fieldName: string): boolean {
    const ctrl = this.certForm.get(fieldName);
    if (!ctrl) return false;

    if (fieldName === 'name' || fieldName === 'organization') {
      const val = ctrl.value;
      const isMissingEn = !val || !val.en || !val.en.trim();
      return (ctrl.touched || this.isSubmitted()) && isMissingEn;
    }

    return ctrl.invalid && (ctrl.touched || this.isSubmitted());
  }

  public onSubmit(): void {
    this.isSubmitted.set(true);

    const nameVal = this.certForm.get('name')?.value;
    const orgVal = this.certForm.get('organization')?.value;

    if (!nameVal?.en?.trim()) {
      this.notificationService.showError('English credential name is required.');
      return;
    }

    if (!orgVal?.en?.trim()) {
      this.notificationService.showError('English issuing organization is required.');
      return;
    }

    if (this.certForm.invalid) {
      this.notificationService.showError('Please fix form validation errors.');
      return;
    }

    this.isSubmitting.set(true);
    const formVal = this.certForm.value;

    const payload: Partial<Certification> = {
      ...formVal,
      expirationDate: formVal.expirationDate ? formVal.expirationDate : undefined,
    };

    if (this.isEditMode() && this.certId()) {
      this.portfolioService.updateAdminCertification(this.certId()!, payload).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.notificationService.showSuccess('Certification updated successfully!');
          this.router.navigate(['/admin/certifications']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.notificationService.showError(err?.error?.message || 'Failed to update certification.');
        },
      });
    } else {
      this.portfolioService.createAdminCertification(payload).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.notificationService.showSuccess('Certification created successfully!');
          this.router.navigate(['/admin/certifications']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.notificationService.showError(err?.error?.message || 'Failed to create certification.');
        },
      });
    }
  }
}
