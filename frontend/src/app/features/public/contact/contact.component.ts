import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { of, catchError } from 'rxjs';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { LanguageService } from '../../../core/services/language.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SocialLink } from '../../../core/models';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <!-- Page Header -->
      <section class="space-y-4 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>{{ isKhmer() ? 'ទំនាក់ទំនង និងសហការ' : 'Get In Touch' }}</span>
        </div>

        <h1 class="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ isKhmer() ? 'តោះចាប់ផ្តើមសហការកសាងគម្រោងថ្មីៗ' : "Let's Build Something Great Together" }}
        </h1>

        <p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed" [class.font-khmer]="isKhmer()">
          {{ isKhmer()
            ? 'មានគម្រោងថ្មី ចម្ងល់បច្ចេកទេស ឬចង់ពិភាក្សាអំពីការងារ? សូមផ្ញើសារមកកាន់ខ្ញុំ ខ្ញុំរីករាយនឹងឆ្លើយតបជានិច្ច។'
            : "Have an exciting project in mind, questions about my engineering work, or looking for a full-stack developer? I'd love to connect with you."
          }}
        </p>
      </section>

      <!-- Main Two-Column Layout (PRD 8.11 & Design.md Section 13: 60% Form / 40% Info) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <!-- Left: Contact Form (7 cols on lg) -->
        <section class="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 md:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div class="space-y-1">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">
              {{ isKhmer() ? 'ផ្ញើសារមកកាន់ខ្ញុំ' : 'Send a Direct Message' }}
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              {{ isKhmer() ? 'បំពេញព័ត៌មានខាងក្រោម ហើយខ្ញុំនឹងឆ្លើយតបក្នុងរយៈពេល ២៤ ម៉ោង។' : 'Fill out the form below and I will get back to you promptly.' }}
            </p>
          </div>

          <!-- Success Alert -->
          @if (isSuccess()) {
            <div
              id="contact-success-alert"
              class="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-3 animate-fadeIn"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-base font-bold">
                    {{ isKhmer() ? 'សារត្រូវបានផ្ញើជោគជ័យ!' : 'Message Sent Successfully!' }}
                  </h3>
                  <p class="text-xs text-emerald-700 dark:text-emerald-300">
                    {{ isKhmer() ? 'សូមអរគុណចំពោះការទាក់ទងមក។ ខ្ញុំនឹងពិនិត្យនិងឆ្លើយតបក្នុងពេលឆាប់ៗនេះ។' : 'Thank you for reaching out. I will review your message and reply soon.' }}
                  </p>
                </div>
              </div>

              <div class="pt-2">
                <button
                  type="button"
                  (click)="resetFormState()"
                  class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                >
                  {{ isKhmer() ? 'ផ្ញើសារមួយផ្សេងទៀត' : 'Send Another Message' }}
                </button>
              </div>
            </div>
          }

          <!-- API Error Alert -->
          @if (submitError()) {
            <div
              id="contact-error-alert"
              class="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200 text-sm flex items-start gap-3"
            >
              <svg class="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="font-semibold">{{ submitError() }}</p>
                <p class="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                  {{ isKhmer() ? 'ទិន្នន័យរបស់អ្នកត្រូវបានរក្សាទុក សូមសាកល្បងចុចផ្ញើម្តងទៀត។' : 'Your input is preserved. Please try submitting again.' }}
                </p>
              </div>
            </div>
          }

          <!-- Form Element -->
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-5" novalidate>
            <!-- Honeypot Field (Anti-Spam per PRD Section 8.11: hidden from humans, filled by bots) -->
            <input
              type="text"
              formControlName="honeypot"
              class="hidden opacity-0 pointer-events-none absolute -left-[9999px]"
              tabindex="-1"
              autocomplete="off"
              aria-hidden="true"
            />

            <!-- Name Field -->
            <div class="space-y-1.5">
              <label for="contact-name" class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <span>{{ isKhmer() ? 'ឈ្មោះរបស់អ្នក' : 'Your Name' }}</span>
                <span class="text-rose-500 ml-0.5">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="contact-name"
                  type="text"
                  formControlName="name"
                  [placeholder]="isKhmer() ? 'ឧ. ឌឹម សារាជ' : 'e.g. John Doe'"
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  [ngClass]="{
                    'border-rose-400 dark:border-rose-500/80 bg-rose-50/20': isFieldInvalid('name'),
                    'border-slate-200 dark:border-slate-700': !isFieldInvalid('name')
                  }"
                />
              </div>
              @if (isFieldInvalid('name')) {
                <p class="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {{ getNameError() }}
                </p>
              }
            </div>

            <!-- Email Field -->
            <div class="space-y-1.5">
              <label for="contact-email" class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <span>{{ isKhmer() ? 'អ៊ីមែល' : 'Email Address' }}</span>
                <span class="text-rose-500 ml-0.5">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="contact-email"
                  type="email"
                  formControlName="email"
                  [placeholder]="isKhmer() ? 'ឧ. example@gmail.com' : 'e.g. john@example.com'"
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  [ngClass]="{
                    'border-rose-400 dark:border-rose-500/80 bg-rose-50/20': isFieldInvalid('email'),
                    'border-slate-200 dark:border-slate-700': !isFieldInvalid('email')
                  }"
                />
              </div>
              @if (isFieldInvalid('email')) {
                <p class="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {{ getEmailError() }}
                </p>
              }
            </div>

            <!-- Subject Field -->
            <div class="space-y-1.5">
              <label for="contact-subject" class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <span>{{ isKhmer() ? 'ប្រធានបទ' : 'Subject' }}</span>
                <span class="text-rose-500 ml-0.5">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <input
                  id="contact-subject"
                  type="text"
                  formControlName="subject"
                  [placeholder]="isKhmer() ? 'ឧ. ការពិភាក្សាអំពីគម្រោងគេហទំព័រថ្មី' : 'e.g. Project Consultation / Job Opportunity'"
                  class="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  [ngClass]="{
                    'border-rose-400 dark:border-rose-500/80 bg-rose-50/20': isFieldInvalid('subject'),
                    'border-slate-200 dark:border-slate-700': !isFieldInvalid('subject')
                  }"
                />
              </div>
              @if (isFieldInvalid('subject')) {
                <p class="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {{ getSubjectError() }}
                </p>
              }
            </div>

            <!-- Message Field (PRD: min 10, max 2000, 6 rows) -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label for="contact-message" class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <span>{{ isKhmer() ? 'ខ្លឹមសារសារ' : 'Message' }}</span>
                  <span class="text-rose-500 ml-0.5">*</span>
                </label>
                <span class="text-[11px] font-mono text-slate-400">
                  {{ contactForm.get('message')?.value?.length || 0 }} / 2000
                </span>
              </div>
              <textarea
                id="contact-message"
                formControlName="message"
                rows="6"
                [placeholder]="isKhmer() ? 'សូមរៀបរាប់ព័ត៌មានលម្អិតអំពីតម្រូវការគម្រោងរបស់អ្នក...' : 'Tell me about your project, timeline, and goals...'"
                class="w-full p-4 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-y"
                [ngClass]="{
                  'border-rose-400 dark:border-rose-500/80 bg-rose-50/20': isFieldInvalid('message'),
                  'border-slate-200 dark:border-slate-700': !isFieldInvalid('message')
                }"
              ></textarea>
              @if (isFieldInvalid('message')) {
                <p class="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {{ getMessageError() }}
                </p>
              }
            </div>

            <!-- Submit Button (shows loading spinner per Design.md 13.3) -->
            <div class="pt-2">
              <button
                type="submit"
                [disabled]="isSubmitting()"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none shadow-lg shadow-indigo-500/25 transition-all duration-200"
              >
                @if (isSubmitting()) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{{ isKhmer() ? 'កំពុងផ្ញើ...' : 'Sending Message...' }}</span>
                } @else {
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>{{ isKhmer() ? 'ផ្ញើសារឥឡូវនេះ' : 'Send Message' }}</span>
                }
              </button>
            </div>
          </form>
        </section>

        <!-- Right: Contact Info & Social Links (5 cols on lg) -->
        <aside class="lg:col-span-5 space-y-6">
          <!-- Availability & Status Card -->
          <div class="p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
            <div class="flex items-center gap-2.5">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {{ isKhmer() ? 'អាចទទួលការងារថ្មីៗបាន' : 'Available for Opportunities' }}
              </span>
            </div>

            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed" [class.font-khmer]="isKhmer()">
              {{ isKhmer()
                ? 'ខ្ញុំបើកចំហរសម្រាប់ការងារពេញម៉ោង គម្រោងកិច្ចសន្យា (Freelance) និងការពិគ្រោះយោបល់លើស្ថាបត្យកម្មប្រព័ន្ធគេហទំព័រ។'
                : 'I am currently open to full-time engineering roles, freelance contracts, and system design consultations.'
              }}
            </p>

            <div class="pt-2 space-y-4 border-t border-slate-100 dark:border-slate-800 text-sm">
              <!-- Email -->
              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    {{ isKhmer() ? 'អាសយដ្ឋានអ៊ីមែល' : 'Direct Email' }}
                  </span>
                  <a
                    [href]="'mailto:' + email()"
                    class="font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {{ email() }}
                  </a>
                </div>
              </div>

              <!-- Location -->
              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    {{ isKhmer() ? 'ទីតាំង' : 'Location' }}
                  </span>
                  <span class="font-semibold text-slate-800 dark:text-slate-200">
                    {{ location() }}
                  </span>
                </div>
              </div>

              <!-- Response Time Expectation -->
              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    {{ isKhmer() ? 'ពេលវេលាឆ្លើយតប' : 'Response Time' }}
                  </span>
                  <span class="text-slate-700 dark:text-slate-300">
                    {{ isKhmer() ? 'ឆ្លើយតបក្នុងរយៈពេល ២៤ ម៉ោង' : 'Replies within 24 hours' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Social Links Card -->
          @if (socialLinks().length > 0) {
            <div class="p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <h3 class="text-base font-bold text-slate-900 dark:text-white">
                {{ isKhmer() ? 'បណ្តាញសង្គម និងការងារ' : 'Connect on Social Media' }}
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ isKhmer() ? 'តាមដានការសរសេរកូដ និងគម្រោងរបស់ខ្ញុំតាមរយៈបណ្តាញទាំងនេះ៖' : 'Follow my open-source work and professional updates:' }}
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                @for (link of socialLinks(); track link._id) {
                  <a
                    [href]="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200/60 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <span class="capitalize">{{ link.platform }}</span>
                    <svg class="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-slate-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                }
              </div>
            </div>
          }
        </aside>
      </div>
    </div>
  `,
})
export class ContactComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly portfolioService = inject(PortfolioService);
  private readonly languageService = inject(LanguageService);
  private readonly notificationService = inject(NotificationService);

  public readonly contactForm: FormGroup;
  public readonly isSubmitting = signal<boolean>(false);
  public readonly isSuccess = signal<boolean>(false);
  public readonly submitError = signal<string | null>(null);

  public readonly email = signal<string>('dimsareach009@gmail.com');
  public readonly location = signal<string>('Phnom Penh, Cambodia');
  public readonly socialLinks = signal<SocialLink[]>([]);

  public readonly isKhmer = computed(() => this.languageService.currentLang() === 'kh');

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      honeypot: [''],
    });
  }

  public ngOnInit(): void {
    this.loadProfile();
    this.loadSocialLinks();
  }

  public loadProfile(): void {
    this.portfolioService.getProfile().pipe(catchError(() => of(null))).subscribe({
      next: (res) => {
        if (res && res.data) {
          if (res.data.email) {
            this.email.set(res.data.email);
          }
          if (res.data.location) {
            const loc = this.isKhmer() ? (res.data.location.kh || res.data.location.en) : res.data.location.en;
            if (loc) {
              this.location.set(loc);
            }
          }
        }
      },
    });
  }

  public loadSocialLinks(): void {
    this.portfolioService.getSocialLinks().pipe(catchError(() => of(null))).subscribe({
      next: (res) => {
        if (res && res.data && Array.isArray(res.data)) {
          this.socialLinks.set(res.data.filter((l) => l.isVisible !== false));
        }
      },
    });
  }

  public isFieldInvalid(fieldName: string): boolean {
    const control = this.contactForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public getNameError(): string {
    const control = this.contactForm.get('name');
    if (!control || !control.errors) return '';
    if (control.errors['required']) {
      return this.isKhmer() ? 'សូមបញ្ចូលឈ្មោះរបស់អ្នក' : 'Name is required';
    }
    if (control.errors['minlength']) {
      return this.isKhmer() ? 'ឈ្មោះត្រូវមានយ៉ាងតិច ២ តួអក្សរ' : 'Name must be at least 2 characters';
    }
    if (control.errors['maxlength']) {
      return this.isKhmer() ? 'ឈ្មោះមិនអាចលើសពី ១០០ តួអក្សរទេ' : 'Name cannot exceed 100 characters';
    }
    return '';
  }

  public getEmailError(): string {
    const control = this.contactForm.get('email');
    if (!control || !control.errors) return '';
    if (control.errors['required']) {
      return this.isKhmer() ? 'សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែល' : 'Email is required';
    }
    if (control.errors['email']) {
      return this.isKhmer() ? 'ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវទេ' : 'Please enter a valid email address';
    }
    return '';
  }

  public getSubjectError(): string {
    const control = this.contactForm.get('subject');
    if (!control || !control.errors) return '';
    if (control.errors['required']) {
      return this.isKhmer() ? 'សូមបញ្ចូលប្រធានបទ' : 'Subject is required';
    }
    if (control.errors['minlength']) {
      return this.isKhmer() ? 'ប្រធានបទត្រូវមានយ៉ាងតិច ៥ តួអក្សរ' : 'Subject must be at least 5 characters';
    }
    if (control.errors['maxlength']) {
      return this.isKhmer() ? 'ប្រធានបទមិនអាចលើសពី ២០០ តួអក្សរទេ' : 'Subject cannot exceed 200 characters';
    }
    return '';
  }

  public getMessageError(): string {
    const control = this.contactForm.get('message');
    if (!control || !control.errors) return '';
    if (control.errors['required']) {
      return this.isKhmer() ? 'សូមបញ្ចូលខ្លឹមសារសារ' : 'Message is required';
    }
    if (control.errors['minlength']) {
      return this.isKhmer() ? 'សារត្រូវមានយ៉ាងតិច ១០ តួអក្សរ' : 'Message must be at least 10 characters';
    }
    if (control.errors['maxlength']) {
      return this.isKhmer() ? 'សារមិនអាចលើសពី ២០០០ តួអក្សរទេ' : 'Message cannot exceed 2000 characters';
    }
    return '';
  }

  public onSubmit(): void {
    this.submitError.set(null);

    // Check honeypot first (PRD 8.11 spam defense)
    const honeypotVal = this.contactForm.get('honeypot')?.value;
    if (honeypotVal) {
      // Silently pretend success to fool spambots
      this.isSuccess.set(true);
      this.contactForm.reset();
      return;
    }

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.contactForm.value;

    this.portfolioService.submitContact({
      name: formValue.name.trim(),
      email: formValue.email.trim(),
      subject: formValue.subject.trim(),
      message: formValue.message.trim(),
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isSuccess.set(true);
        this.contactForm.reset();
        this.notificationService.success(
          this.isKhmer() ? 'សាររបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ!' : 'Message sent successfully!',
        );
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const msg = err?.error?.message ||
          (this.isKhmer()
            ? 'មិនអាចផ្ញើសារបានទេ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។'
            : 'Failed to send message. Please try again later.');
        this.submitError.set(msg);
        this.notificationService.error(msg);
      },
    });
  }

  public resetFormState(): void {
    this.isSuccess.set(false);
    this.submitError.set(null);
    this.contactForm.reset();
  }
}
