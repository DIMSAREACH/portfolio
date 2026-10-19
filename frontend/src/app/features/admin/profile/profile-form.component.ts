import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { Profile } from '../../../core/models';
import { BilingualFieldComponent, ImageUploadComponent, MarkdownEditorComponent } from '../shared';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-admin-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BilingualFieldComponent,
    ImageUploadComponent,
    MarkdownEditorComponent,
    AvatarModule,
  ],
  template: `
    <div class="w-full space-y-6 animate-fadeIn pb-12">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400" [class.font-khmer]="isKhmer()">
              {{ isKhmer() ? 'ម៉ាកសញ្ញាផ្ទាល់ខ្លួន' : 'Personal Brand' }}
            </span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight" [class.font-khmer]="isKhmer()">
            {{ isKhmer() ? 'ព័ត៌មានប្រវត្តិរូប & ជីវប្រវត្តិ' : 'Author Profile & Bio' }}
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5" [class.font-khmer]="isKhmer()">
            {{ isKhmer() ? 'គ្រប់គ្រងអត្តសញ្ញាណផ្ទាល់ខ្លួន ព័ត៌មានទំនាក់ទំនង រូបភាពបញ្ឈរ និងការពិពណ៌នាជីវប្រវត្តិពីរភាសា។' : 'Manage your personal identity, contact details, headshot portraits, and bilingual biographical narratives.' }}
          </p>
        </div>
      </div>

      <!-- Main Profile Form -->
      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-8">
        <!-- Section 1: Identity & Key Titles -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3" [class.font-khmer]="isKhmer()">
            {{ isKhmer() ? 'អត្តសញ្ញាណ & មុខតំណែងវិជ្ជាជីវៈ' : 'Identity & Professional Titles' }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Full Name -->
            <app-bilingual-field
              label="Full Name"
              [required]="true"
              placeholderEn="e.g. Sareach Dim"
              placeholderKh="e.g. ឌឹម សារាជ"
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
              <label for="profile-email-input" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Public Email
              </label>
              <input
                id="profile-email-input"
                type="email"
                formControlName="email"
                placeholder="developer@example.com"
                class="w-full px-4 py-2.5 text-sm rounded-xl min-h-[42px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label for="profile-phone-input" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Phone Number
              </label>
              <input
                id="profile-phone-input"
                type="tel"
                formControlName="phone"
                placeholder="+855 12 345 678"
                class="w-full px-4 py-2.5 text-sm rounded-xl min-h-[42px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                [value]="profileImagePreview()"
                (fileSelected)="onProfileImageSelected($event)"
                (imageRemoved)="onProfileImageRemoved()"
              ></app-image-upload>

              <div>
                <label for="profile-image-url-input" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Direct Profile Image URL
                </label>
                <input
                  id="profile-image-url-input"
                  type="text"
                  inputmode="url"
                  formControlName="profileImage"
                  (input)="onDirectProfileUrlInput()"
                  placeholder="https://..."
                  class="w-full px-4 py-2.5 text-sm rounded-xl min-h-[42px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <!-- Live Circular Avatar Preview Badge -->
              @if (profileImagePreview()) {
                <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center gap-3.5">
                  <div class="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-indigo-500/40 shrink-0 shadow-sm bg-slate-100 dark:bg-slate-700">
                    <img
                      [src]="profileImagePreview()"
                      alt="Avatar Circular Preview"
                      class="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5">
                      <span class="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Public Avatar Preview
                      </span>
                      <span class="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200/50 dark:border-indigo-800/50">
                        Hero & Nav
                      </span>
                    </div>
                    <span class="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      Circular top-centered crop displayed across public pages
                    </span>
                  </div>
                </div>
              }

              <!-- Quick Demo Preset Avatars with PrimeNG p-avatar -->
              <div class="pt-1">
                <span class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Sample Preset Avatars
                </span>
                <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
                  @for (demoImg of demoAvatars; track demoImg) {
                    <button
                      type="button"
                      (click)="selectPresetAvatar(demoImg)"
                      class="transition-transform hover:scale-110 focus:outline-none rounded-full ring-2 transition-all p-0.5 cursor-pointer"
                      [class.ring-indigo-600]="profileForm.get('profileImage')?.value === demoImg"
                      [class.ring-transparent]="profileForm.get('profileImage')?.value !== demoImg"
                      [title]="'Select avatar'"
                    >
                      <p-avatar [image]="demoImg" size="large" shape="circle" />
                    </button>
                  }
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <app-image-upload
                label="About Section Action Photo"
                aspectRatio="landscape"
                helperText="Landscape photo for about narrative or working setup."
                [value]="aboutImagePreview()"
                (fileSelected)="onAboutImageSelected($event)"
                (imageRemoved)="onAboutImageRemoved()"
              ></app-image-upload>

              <div>
                <label for="about-image-url-input" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Direct About Image URL
                </label>
                <input
                  id="about-image-url-input"
                  type="text"
                  inputmode="url"
                  formControlName="aboutImage"
                  (input)="onDirectAboutUrlInput()"
                  placeholder="https://..."
                  class="w-full px-4 py-2.5 text-sm rounded-xl min-h-[42px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <!-- Live About Section Card Preview Badge -->
              @if (aboutImagePreview()) {
                <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center gap-3.5">
                  <div class="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-emerald-500/40 shrink-0 shadow-sm bg-slate-100 dark:bg-slate-700">
                    <img
                      [src]="aboutImagePreview()"
                      alt="About Photo Preview"
                      class="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5">
                      <span class="text-xs font-bold text-slate-800 dark:text-slate-200">
                        About Card Preview
                      </span>
                      <span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200/50 dark:border-emerald-800/50">
                        About Page
                      </span>
                    </div>
                    <span class="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      Featured wide visual displayed in the narrative section
                    </span>
                  </div>
                </div>
              }
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

          </div>

          <div formGroupName="about">
            <app-markdown-editor
              label="Biography Story"
              placeholder="# My Journey&#10;&#10;Write your career story here..."
              [rows]="10"
              formControlName="en"
            ></app-markdown-editor>
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
            class="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
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
  private readonly authService = inject(AuthService, { optional: true });
  public readonly languageService = inject(LanguageService, { optional: true });
  public readonly isKhmer = computed(() => this.languageService?.isKhmer() ?? false);

  public readonly isSubmitting = signal<boolean>(false);
  public readonly activeAboutLang = signal<'en' | 'kh'>('en');

  public readonly profileImagePreview = signal<string>('');
  public readonly aboutImagePreview = signal<string>('');

  public selectedProfileFile: File | null = null;
  public selectedAboutFile: File | null = null;

  public readonly demoAvatars: string[] = [
    'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
    'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png',
    'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png',
  ];

  public selectPresetAvatar(url: string): void {
    this.selectedProfileFile = null;
    this.profileImagePreview.set(url);
    this.profileForm.patchValue({ profileImage: url });
    this.profileForm.markAsDirty();
  }

  public onDirectProfileUrlInput(): void {
    this.selectedProfileFile = null;
    const val = this.profileForm.get('profileImage')?.value || '';
    this.profileImagePreview.set(val);
    this.profileForm.markAsDirty();
  }

  public onDirectAboutUrlInput(): void {
    this.selectedAboutFile = null;
    const val = this.profileForm.get('aboutImage')?.value || '';
    this.aboutImagePreview.set(val);
    this.profileForm.markAsDirty();
  }

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

        if (p.profileImage) {
          this.profileImagePreview.set(p.profileImage);
        }
        if (p.aboutImage) {
          this.aboutImagePreview.set(p.aboutImage);
        }
      },
      error: () => {
        this.notificationService.showError('Failed to load profile data.');
      },
    });
  }

  public onProfileImageSelected(file: File): void {
    this.selectedProfileFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.profileImagePreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
    this.profileForm.markAsDirty();
  }

  public onProfileImageRemoved(): void {
    this.selectedProfileFile = null;
    this.profileImagePreview.set('');
    this.profileForm.patchValue({ profileImage: '' });
    this.profileForm.markAsDirty();
  }

  public onAboutImageSelected(file: File): void {
    this.selectedAboutFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.aboutImagePreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
    this.profileForm.markAsDirty();
  }

  public onAboutImageRemoved(): void {
    this.selectedAboutFile = null;
    this.aboutImagePreview.set('');
    this.profileForm.patchValue({ aboutImage: '' });
    this.profileForm.markAsDirty();
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

    // If binary image files are selected, send via FormData multipart
    if (this.selectedProfileFile || this.selectedAboutFile) {
      const formData = new FormData();
      formData.append('fullName', JSON.stringify({
        en: formVal.fullName.en,
        kh: formVal.fullName.kh || formVal.fullName.en,
      }));
      formData.append('title', JSON.stringify({
        en: formVal.title.en,
        kh: formVal.title.kh || formVal.title.en,
      }));
      formData.append('introduction', JSON.stringify({
        en: formVal.introduction.en,
        kh: formVal.introduction.kh || formVal.introduction.en,
      }));
      formData.append('about', JSON.stringify({
        en: formVal.about.en,
        kh: formVal.about.kh || formVal.about.en,
      }));
      if (formVal.email) formData.append('email', formVal.email);
      if (formVal.phone) formData.append('phone', formVal.phone);
      if (formVal.location) formData.append('location', JSON.stringify(formVal.location));
      if (formVal.professionalSummary) formData.append('professionalSummary', JSON.stringify(formVal.professionalSummary));
      if (formVal.careerInterests) formData.append('careerInterests', JSON.stringify(formVal.careerInterests));
      if (formVal.background) formData.append('background', JSON.stringify(formVal.background));
      if (formVal.goals) formData.append('goals', JSON.stringify(formVal.goals));

      if (this.selectedProfileFile) {
        formData.append('profileImage', this.selectedProfileFile);
      } else if (formVal.profileImage && !formVal.profileImage.startsWith('file://') && !formVal.profileImage.startsWith('blob:') && !formVal.profileImage.startsWith('data:')) {
        formData.append('profileImage', formVal.profileImage);
      }

      if (this.selectedAboutFile) {
        formData.append('aboutImage', this.selectedAboutFile);
      } else if (formVal.aboutImage && !formVal.aboutImage.startsWith('file://') && !formVal.aboutImage.startsWith('blob:') && !formVal.aboutImage.startsWith('data:')) {
        formData.append('aboutImage', formVal.aboutImage);
      }

      this.portfolioService.upsertAdminProfile(formData).subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.selectedProfileFile = null;
          this.selectedAboutFile = null;
          this.notificationService.showSuccess('Profile updated successfully!');
          if (res.data) {
            this.profileForm.patchValue({
              profileImage: res.data.profileImage || '',
              aboutImage: res.data.aboutImage || '',
            });
            this.profileImagePreview.set(res.data.profileImage || '');
            this.aboutImagePreview.set(res.data.aboutImage || '');
            if (this.authService) {
              const newAvatar = res.data.profileImage || formVal.profileImage;
              const newName = formVal.fullName?.en;
              this.authService.currentUser.update((u) => {
                if (!u) return u;
                return {
                  ...u,
                  ...(newName ? { fullName: newName } : {}),
                  ...(newAvatar ? { avatar: newAvatar } : {}),
                };
              });
            }
          }
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.notificationService.showError(err?.error?.message || 'Failed to save profile.');
        },
      });
      return;
    }

    // Otherwise, send JSON payload
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
      profileImage:
        formVal.profileImage && !formVal.profileImage.startsWith('blob:') && !formVal.profileImage.startsWith('data:')
          ? formVal.profileImage
          : undefined,
      aboutImage:
        formVal.aboutImage && !formVal.aboutImage.startsWith('blob:') && !formVal.aboutImage.startsWith('data:')
          ? formVal.aboutImage
          : undefined,
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
          this.profileImagePreview.set(res.data.profileImage || this.profileForm.get('profileImage')?.value || '');
          this.aboutImagePreview.set(res.data.aboutImage || this.profileForm.get('aboutImage')?.value || '');
          if (this.authService) {
            const newAvatar = res.data.profileImage || formVal.profileImage;
            const newName = formVal.fullName?.en;
            this.authService.currentUser.update((u) => {
              if (!u) return u;
              return {
                ...u,
                ...(newName ? { fullName: newName } : {}),
                ...(newAvatar ? { avatar: newAvatar } : {}),
              };
            });
          }
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.notificationService.showError(err?.error?.message || 'Failed to save profile.');
      },
    });
  }
}
