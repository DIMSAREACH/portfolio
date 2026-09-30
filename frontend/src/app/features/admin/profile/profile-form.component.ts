import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Profile } from '../../../core/models';
import { BilingualFieldComponent, ImageUploadComponent, MarkdownEditorComponent } from '../shared';

@Component({
  selector: 'app-admin-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BilingualFieldComponent,
    ImageUploadComponent,
    MarkdownEditorComponent,
  ],
  template: `
    <div class="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Personal Brand
            </span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Author Profile & Bio
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your personal identity, contact details, headshot portraits, and bilingual biographical narratives.
          </p>
        </div>
      </div>

      <!-- Main Profile Form -->
      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-8">
        <!-- Section 1: Identity & Key Titles -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Identity & Professional Titles
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Full Name -->
            <app-bilingual-field
              label="Full Name"
              [required]="true"
              placeholderEn="e.g. Sareach Dim"
              placeholderKh="e.g. ឌីម សារាជ"
              formControlName="fullName"
            ></app-bilingual-field>

            <!-- Title -->
            <app-bilingual-field
              label="Professional Headline"
              [required]="true"
              placeholderEn="e.g. Senior Full-Stack Cloud Engineer"
              placeholderKh="e.g. វិស្វករ Cloud និង Full-Stack ជាន់ខ្ពស់"
              formControlName="title"
            ></app-bilingual-field>
          </div>

          <!-- Introduction Hook -->
          <div>
            <app-bilingual-field
              label="Hero Introduction"
              fieldType="textarea"
              [required]="true"
              placeholderEn="Passionate software architect focused on building resilient systems..."
              placeholderKh="វិស្វករផ្នែកទន់ដែលផ្តោតលើការកសាងប្រព័ន្ធដែលមានប្រសិទ្ធភាពខ្ពស់..."
              formControlName="introduction"
              [rows]="3"
            ></app-bilingual-field>
          </div>
        </div>

        <!-- Section 2: Contact Information & Location -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Contact Information & Location
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label for="profile-email-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Public Email
              </label>
              <input
                id="profile-email-input"
                type="email"
                formControlName="email"
                placeholder="developer@example.com"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label for="profile-phone-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Phone Number
              </label>
              <input
                id="profile-phone-input"
                type="tel"
                formControlName="phone"
                placeholder="+855 12 345 678"
                class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <app-bilingual-field
                label="Location"
                placeholderEn="Phnom Penh, Cambodia"
                placeholderKh="រាជធានីភ្នំពេញ កម្ពុជា"
                formControlName="location"
              ></app-bilingual-field>
            </div>
          </div>
        </div>

        <!-- Section 3: Portraits & Media -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Portraits & Visual Assets
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-3">
              <app-image-upload
                label="Primary Avatar / Profile Headshot"
                aspectRatio="square"
                helperText="Square portrait for hero, navigation, and author cards."
                [value]="profileForm.get('profileImage')?.value"
                (fileSelected)="onProfileImageSelected($event)"
                (imageRemoved)="onProfileImageRemoved()"
              ></app-image-upload>

              <div>
                <label for="profile-image-url-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Direct Profile Image URL
                </label>
                <input
                  id="profile-image-url-input"
                  type="url"
                  formControlName="profileImage"
                  placeholder="https://..."
                  class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div class="space-y-3">
              <app-image-upload
                label="About Section Action Photo"
                aspectRatio="landscape"
                helperText="Landscape photo for about narrative or working setup."
                [value]="profileForm.get('aboutImage')?.value"
                (fileSelected)="onAboutImageSelected($event)"
                (imageRemoved)="onAboutImageRemoved()"
              ></app-image-upload>

              <div>
                <label for="about-image-url-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Direct About Image URL
                </label>
                <input
                  id="about-image-url-input"
                  type="url"
                  formControlName="aboutImage"
                  placeholder="https://..."
                  class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Section 4: In-Depth About Narrative (Markdown) -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                About Narrative (Markdown)
              </h2>
              <p class="text-xs text-slate-400 mt-0.5">
                Detailed story displayed on your public /about page.
              </p>
            </div>

            <!-- Tab switch -->
            <div class="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl" role="tablist">
              <button
                type="button"
                role="tab"
                (click)="activeAboutLang.set('en')"
                class="px-3 py-1 text-xs font-semibold rounded-lg transition-all"
                [class.bg-white]="activeAboutLang() === 'en'"
                [class.dark:bg-slate-700]="activeAboutLang() === 'en'"
                [class.text-indigo-600]="activeAboutLang() === 'en'"
                [class.dark:text-indigo-400]="activeAboutLang() === 'en'"
              >
                English Story
              </button>
              <button
                type="button"
                role="tab"
                (click)="activeAboutLang.set('kh')"
                class="px-3 py-1 text-xs font-semibold rounded-lg transition-all"
                [class.bg-white]="activeAboutLang() === 'kh'"
                [class.dark:bg-slate-700]="activeAboutLang() === 'kh'"
                [class.text-indigo-600]="activeAboutLang() === 'kh'"
                [class.dark:text-indigo-400]="activeAboutLang() === 'kh'"
              >
                Khmer Story
              </button>
            </div>
          </div>

          <div formGroupName="about">
            <div [class.hidden]="activeAboutLang() !== 'en'">
              <app-markdown-editor
                label="English Biography"
                placeholder="# My Journey&#10;&#10;Write your career story here..."
                [rows]="10"
                formControlName="en"
              ></app-markdown-editor>
            </div>
            <div [class.hidden]="activeAboutLang() !== 'kh'">
              <app-markdown-editor
                label="Khmer Biography"
                placeholder="# ដំណើរជីវិតការងារ&#10;&#10;សរសេររឿងរ៉ាវការងាររបស់អ្នកនៅទីនេះ..."
                [rows]="10"
                formControlName="kh"
              ></app-markdown-editor>
            </div>
          </div>
        </div>

        <!-- Section 5: Summaries & Goals -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Summaries, Background & Ambitions
          </h2>

          <div class="space-y-4">
            <app-bilingual-field
              label="Professional Summary"
              fieldType="textarea"
              placeholderEn="Overview of experience, architectures designed, teams led..."
              formControlName="professionalSummary"
              [rows]="3"
            ></app-bilingual-field>

            <app-bilingual-field
              label="Career Interests & Domains"
              fieldType="textarea"
              placeholderEn="Distributed systems, developer tooling, cloud infrastructure..."
              formControlName="careerInterests"
              [rows]="2"
            ></app-bilingual-field>

            <app-bilingual-field
              label="Educational & Technical Background"
              fieldType="textarea"
              placeholderEn="Computer Science background and industry training..."
              formControlName="background"
              [rows]="2"
            ></app-bilingual-field>

            <app-bilingual-field
              label="Future Goals & Aspirations"
              fieldType="textarea"
              placeholderEn="Open source contributions, technical leadership..."
              formControlName="goals"
              [rows]="2"
            ></app-bilingual-field>
          </div>
        </div>

        <!-- Action Controls -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            [disabled]="isSubmitting()"
            class="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
          >
            @if (isSubmitting()) {
              <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Saving Profile...</span>
            } @else {
              <span>Save Profile Changes</span>
            }
          </button>
        </div>
      </form>
    </div>
  `,
})
export class ProfileFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly portfolioService = inject(PortfolioService);
  private readonly notificationService = inject(NotificationService);

  public readonly isSubmitting = signal<boolean>(false);
  public readonly activeAboutLang = signal<'en' | 'kh'>('en');

  public selectedProfileFile: File | null = null;
  public selectedAboutFile: File | null = null;

  public readonly profileForm: FormGroup = this.fb.group({
    fullName: [{ en: '', kh: '' }, Validators.required],
    title: [{ en: '', kh: '' }, Validators.required],
    introduction: [{ en: '', kh: '' }, Validators.required],
    email: [''],
    phone: [''],
    location: [{ en: '', kh: '' }],
    profileImage: [''],
    aboutImage: [''],
    about: this.fb.group({
      en: [''],
      kh: [''],
    }),
    professionalSummary: [{ en: '', kh: '' }],
    careerInterests: [{ en: '', kh: '' }],
    background: [{ en: '', kh: '' }],
    goals: [{ en: '', kh: '' }],
  });

  public ngOnInit(): void {
    this.loadProfile();
  }

  public loadProfile(): void {
    this.portfolioService.getAdminProfile().subscribe({
      next: (res) => {
        const p = res.data;
        if (!p) return;

        this.profileForm.patchValue({
          fullName: p.fullName || { en: '', kh: '' },
          title: p.title || { en: '', kh: '' },
          introduction: p.introduction || { en: '', kh: '' },
          email: p.email || '',
          phone: p.phone || '',
          location: p.location || { en: '', kh: '' },
          profileImage: p.profileImage || '',
          aboutImage: p.aboutImage || '',
          about: {
            en: p.about?.en || '',
            kh: p.about?.kh || '',
          },
          professionalSummary: p.professionalSummary || { en: '', kh: '' },
          careerInterests: p.careerInterests || { en: '', kh: '' },
          background: p.background || { en: '', kh: '' },
          goals: p.goals || { en: '', kh: '' },
        });
      },
      error: () => {
        this.notificationService.showError('Failed to load profile data.');
      },
    });
  }

  public onProfileImageSelected(file: File): void {
    this.selectedProfileFile = file;
    this.profileForm.patchValue({ profileImage: 'file://' + file.name });
  }

  public onProfileImageRemoved(): void {
    this.selectedProfileFile = null;
    this.profileForm.patchValue({ profileImage: '' });
  }

  public onAboutImageSelected(file: File): void {
    this.selectedAboutFile = file;
    this.profileForm.patchValue({ aboutImage: 'file://' + file.name });
  }

  public onAboutImageRemoved(): void {
    this.selectedAboutFile = null;
    this.profileForm.patchValue({ aboutImage: '' });
  }

  public onSubmit(): void {
    const fullNameVal = this.profileForm.get('fullName')?.value;
    if (!fullNameVal?.en?.trim()) {
      this.notificationService.showError('English full name is required.');
      return;
    }

    if (this.profileForm.invalid) {
      this.notificationService.showError('Please check form fields for errors.');
      return;
    }

    this.isSubmitting.set(true);
    const formVal = this.profileForm.value;

    const payload: Partial<Profile> = {
      fullName: {
        en: formVal.fullName.en,
        kh: formVal.fullName.kh || formVal.fullName.en,
      },
      title: {
        en: formVal.title.en,
        kh: formVal.title.kh || formVal.title.en,
      },
      introduction: {
        en: formVal.introduction.en,
        kh: formVal.introduction.kh || formVal.introduction.en,
      },
      email: formVal.email || undefined,
      phone: formVal.phone || undefined,
      location: formVal.location,
      profileImage: formVal.profileImage || undefined,
      aboutImage: formVal.aboutImage || undefined,
      about: {
        en: formVal.about.en,
        kh: formVal.about.kh || formVal.about.en,
      },
      professionalSummary: formVal.professionalSummary,
      careerInterests: formVal.careerInterests,
      background: formVal.background,
      goals: formVal.goals,
    };

    this.portfolioService.upsertAdminProfile(payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.notificationService.showSuccess('Profile updated successfully!');
        if (res.data) {
          this.profileForm.patchValue({
            profileImage: res.data.profileImage || this.profileForm.get('profileImage')?.value,
            aboutImage: res.data.aboutImage || this.profileForm.get('aboutImage')?.value,
          });
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.notificationService.showError(err?.error?.message || 'Failed to save profile.');
      },
    });
  }
}
