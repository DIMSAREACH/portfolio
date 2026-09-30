import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Settings } from '../../../core/models';
import { BilingualFieldComponent } from '../shared';

@Component({
  selector: 'app-admin-settings-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BilingualFieldComponent],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      <!-- Header -->
      <div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            System Preferences
          </span>
        </div>
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
          Website & System Settings
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure global platform metadata, feature flags, email alerts, and maintenance switch.
        </p>
      </div>

      <!-- Settings Form -->
      <form [formGroup]="settingsForm" (ngSubmit)="onSubmit()" class="space-y-8">
        <!-- Section 1: Global SEO & Titles -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Global Site Metadata & SEO
          </h2>

          <div class="space-y-4">
            <app-bilingual-field
              label="Default Site Title"
              [required]="true"
              placeholderEn="e.g. Sareach Dim | Full-Stack Cloud Architect"
              placeholderKh="e.g. ឌីម សារាជ | វិស្វករ Cloud និង Full-Stack"
              formControlName="siteTitle"
            ></app-bilingual-field>

            <app-bilingual-field
              label="Default Meta Description"
              fieldType="textarea"
              placeholderEn="Portfolio of Sareach Dim, specializing in scalable web systems..."
              placeholderKh="គេហទំព័រផ្ទាល់ខ្លួនរបស់ ឌីម សារាជ..."
              formControlName="siteDescription"
              [rows]="3"
            ></app-bilingual-field>
          </div>
        </div>

        <!-- Section 2: Feature Flags & Controls -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Platform Features & Public Toggles
          </h2>

          <div class="divide-y divide-slate-100 dark:divide-slate-800">
            <!-- CV Download Toggle -->
            <div class="py-4 flex items-center justify-between">
              <div>
                <span class="block text-xs font-bold text-slate-900 dark:text-white">Enable CV Download</span>
                <span class="text-[11px] text-slate-400">Display "Download CV" button in header and navigation</span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer ml-4">
                <input type="checkbox" formControlName="enableCvDownload" class="sr-only peer" />
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:bg-slate-700"></div>
              </label>
            </div>

            <!-- Contact Form Toggle -->
            <div class="py-4 flex items-center justify-between">
              <div>
                <span class="block text-xs font-bold text-slate-900 dark:text-white">Enable Contact Inquiries</span>
                <span class="text-[11px] text-slate-400">Allow visitors to send messages through the /contact page</span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer ml-4">
                <input type="checkbox" formControlName="enableContactForm" class="sr-only peer" />
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:bg-slate-700"></div>
              </label>
            </div>

            <!-- Email Notification Toggle -->
            <div class="py-4 flex items-center justify-between">
              <div>
                <span class="block text-xs font-bold text-slate-900 dark:text-white">New Message Email Alerts</span>
                <span class="text-[11px] text-slate-400">Dispatch an immediate email when a new inquiry is submitted</span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer ml-4">
                <input type="checkbox" formControlName="emailNotifications" class="sr-only peer" />
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:bg-slate-700"></div>
              </label>
            </div>

            <!-- Maintenance Mode Toggle -->
            <div class="py-4 flex items-center justify-between">
              <div>
                <span class="block text-xs font-bold text-slate-900 dark:text-white">Maintenance Mode</span>
                <span class="text-[11px] text-slate-400">Display "Under Maintenance" placeholder to non-admin visitors</span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer ml-4">
                <input type="checkbox" formControlName="maintenanceMode" class="sr-only peer" />
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600 dark:bg-slate-700"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Section 3: Notification Email Configuration -->
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            Admin Notification Address
          </h2>

          <div class="max-w-md space-y-1.5">
            <label for="settings-notif-email" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Inquiry Alert Destination Email
            </label>
            <input
              id="settings-notif-email"
              type="email"
              formControlName="notificationEmail"
              placeholder="admin@example.com"
              class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <p class="text-[11px] text-slate-400">
              When email notifications are enabled, messages sent via the contact form will be forwarded here.
            </p>
          </div>
        </div>

        <!-- Action Controls -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            [disabled]="isSaving()"
            class="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
          >
            @if (isSaving()) {
              <svg class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Updating Settings...</span>
            } @else {
              <span>Save System Settings</span>
            }
          </button>
        </div>
      </form>
    </div>
  `,
})
export class SettingsFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly portfolioService = inject(PortfolioService);
  private readonly notificationService = inject(NotificationService);

  public readonly isSaving = signal<boolean>(false);

  public readonly settingsForm: FormGroup = this.fb.group({
    siteTitle: [{ en: '', kh: '' }, Validators.required],
    siteDescription: [{ en: '', kh: '' }],
    enableCvDownload: [true],
    enableContactForm: [true],
    emailNotifications: [false],
    notificationEmail: ['', [Validators.email]],
    maintenanceMode: [false],
  });

  public ngOnInit(): void {
    this.loadSettings();
  }

  public loadSettings(): void {
    this.portfolioService.getAdminSettings().subscribe({
      next: (res) => {
        const s = res.data;
        if (!s) return;

        this.settingsForm.patchValue({
          siteTitle: s.siteTitle || { en: '', kh: '' },
          siteDescription: s.siteDescription || { en: '', kh: '' },
          enableCvDownload: s.enableCvDownload !== false,
          enableContactForm: s.enableContactForm !== false,
          emailNotifications: !!s.emailNotifications,
          notificationEmail: s.notificationEmail || '',
          maintenanceMode: !!s.maintenanceMode,
        });
      },
      error: () => {
        this.notificationService.showError('Failed to load system settings.');
      },
    });
  }

  public onSubmit(): void {
    if (this.settingsForm.invalid) {
      this.notificationService.showError('Please check form fields for errors.');
      return;
    }

    this.isSaving.set(true);
    const formVal = this.settingsForm.value;

    const payload: Partial<Settings> = {
      siteTitle: formVal.siteTitle,
      siteDescription: formVal.siteDescription,
      enableCvDownload: !!formVal.enableCvDownload,
      enableContactForm: !!formVal.enableContactForm,
      emailNotifications: !!formVal.emailNotifications,
      notificationEmail: formVal.notificationEmail || undefined,
      maintenanceMode: !!formVal.maintenanceMode,
    };

    this.portfolioService.updateAdminSettings(payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.notificationService.showSuccess('Settings updated successfully!');
      },
      error: (err) => {
        this.isSaving.set(false);
        this.notificationService.showError(err?.error?.message || 'Failed to update settings.');
      },
    });
  }
}
