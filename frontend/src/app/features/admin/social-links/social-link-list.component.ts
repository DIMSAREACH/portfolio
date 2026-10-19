import { Component, OnInit, OnDestroy, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SocialLink, SocialPlatform } from '../../../core/models';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ConfirmDialogComponent } from '../../../shared';

@Component({
  selector: 'app-admin-social-link-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CascadeSelectModule],
  template: `
    <div class="space-y-6 animate-fadeIn pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Outreach & Channels
            </span>
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Social Links & Profiles
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure external social profiles, developer repositories, and contact hyperlinks.
          </p>
        </div>

        <button
          type="button"
          (click)="openCreateModal()"
          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 self-start sm:self-auto"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>New Link</span>
        </button>
      </div>

      <!-- Table View -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse" aria-label="Social Links Table">
            <thead>
              <tr class="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th scope="col" class="px-6 py-4">Platform</th>
                <th scope="col" class="px-6 py-4">Label</th>
                <th scope="col" class="px-6 py-4">Target Destination URL</th>
                <th scope="col" class="px-6 py-4 text-center">Visibility</th>
                <th scope="col" class="px-6 py-4 text-center">Order</th>
                <th scope="col" class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              @if (isLoading()) {
                @for (_ of [1, 2, 3]; track $index) {
                  <tr class="animate-pulse">
                    <td class="px-6 py-4"><div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div></td>
                    <td class="px-6 py-4"><div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div></td>
                    <td class="px-6 py-4"><div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48"></div></td>
                    <td class="px-6 py-4 text-center"><div class="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-12 mx-auto"></div></td>
                    <td class="px-6 py-4 text-center"><div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-8 mx-auto"></div></td>
                    <td class="px-6 py-4 text-right"><div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 ml-auto"></div></td>
                  </tr>
                }
              } @else if (socialLinks().length === 0) {
                <tr>
                  <td colspan="6" class="px-6 py-12 text-center text-slate-400">
                    No social links configured yet. Click "New Link" to add your GitHub, LinkedIn, or Email.
                  </td>
                </tr>
              } @else {
                @for (link of socialLinks(); track link._id) {
                  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td class="px-6 py-4 font-bold text-slate-900 dark:text-white capitalize flex items-center gap-3">
                      @switch (getPlatformKey(link)) {
                        @case ('telegram') {
                          <div class="w-8 h-8 rounded-xl bg-[#229ED9]/15 text-[#229ED9] border border-[#229ED9]/30 flex items-center justify-center shadow-2xs">
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.939z"/>
                            </svg>
                          </div>
                        }
                        @case ('github') {
                          <div class="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center shadow-2xs">
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                            </svg>
                          </div>
                        }
                        @case ('linkedin') {
                          <div class="w-8 h-8 rounded-xl bg-[#0A66C2]/15 text-[#0A66C2] dark:text-[#388bfd] border border-[#0A66C2]/30 flex items-center justify-center shadow-2xs">
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </div>
                        }
                        @case ('facebook') {
                          <div class="w-8 h-8 rounded-xl bg-[#1877F2]/15 text-[#1877F2] border border-[#1877F2]/30 flex items-center justify-center shadow-2xs">
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          </div>
                        }
                        @case ('twitter') {
                          <div class="w-8 h-8 rounded-xl bg-slate-900 text-white dark:bg-slate-700 flex items-center justify-center shadow-2xs">
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                          </div>
                        }
                        @case ('youtube') {
                          <div class="w-8 h-8 rounded-xl bg-[#FF0000]/15 text-[#FF0000] border border-[#FF0000]/30 flex items-center justify-center shadow-2xs">
                            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                          </div>
                        }
                        @case ('email') {
                          <div class="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 border border-amber-500/30 flex items-center justify-center shadow-2xs">
                            <svg class="w-4 h-4 fill-none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                          </div>
                        }
                        @default {
                          <div class="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center shadow-2xs">
                            <svg class="w-4 h-4 fill-none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                            </svg>
                          </div>
                        }
                      }
                      <span>{{ getPlatformDisplay(link) }}</span>
                    </td>

                    <td class="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                      {{ link.label }}
                    </td>

                    <td class="px-6 py-4 font-mono text-xs text-slate-500 max-w-xs truncate">
                      <a [href]="link.url" target="_blank" rel="noopener noreferrer" class="hover:text-indigo-600 dark:hover:text-indigo-400 underline decoration-slate-300 dark:decoration-slate-700">
                        {{ link.url }}
                      </a>
                    </td>

                    <td class="px-6 py-4 text-center">
                      <button
                        type="button"
                        (click)="toggleVisibility(link)"
                        class="px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer"
                        [class.bg-emerald-50]="link.isVisible"
                        [class.text-emerald-700]="link.isVisible"
                        [class.border-emerald-200]="link.isVisible"
                        [class.dark:bg-emerald-950/60]="link.isVisible"
                        [class.dark:text-emerald-300]="link.isVisible"
                        [class.bg-slate-100]="!link.isVisible"
                        [class.text-slate-500]="!link.isVisible"
                        [class.border-slate-200]="!link.isVisible"
                        [class.dark:bg-slate-800]="!link.isVisible"
                        [class.dark:text-slate-400]="!link.isVisible"
                      >
                        {{ link.isVisible ? 'Visible' : 'Hidden' }}
                      </button>
                    </td>

                    <td class="px-6 py-4 text-center text-slate-600 dark:text-slate-400 font-mono text-sm">
                      {{ link.order ?? 0 }}
                    </td>

                    <td class="px-6 py-4 text-right whitespace-nowrap">
                      <div class="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          (click)="onEditClick($event, link)"
                          class="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600 border border-indigo-200/80 hover:bg-indigo-100 hover:text-indigo-700 hover:border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800/60 dark:hover:bg-indigo-900/60 dark:hover:text-indigo-300 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs hover:scale-105 active:scale-95"
                          title="Edit"
                          aria-label="Edit link"
                        >
                          <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          (click)="onDeleteClick($event, link)"
                          class="w-8 h-8 rounded-lg flex items-center justify-center bg-rose-50 text-rose-600 border border-rose-200/80 hover:bg-rose-100 hover:text-rose-700 hover:border-rose-300 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60 dark:hover:bg-rose-900/60 dark:hover:text-rose-300 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs hover:scale-105 active:scale-95"
                          title="Delete"
                          aria-label="Delete link"
                        >
                          <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

      <!-- Modal Dialog -->
      @if (showModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 class="text-lg font-black text-slate-900 dark:text-white">
                {{ editingLinkId ? 'Edit Social Link' : 'Add Social Profile Link' }}
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

            <form [formGroup]="linkForm" (ngSubmit)="saveLink()" class="space-y-4">
              <!-- Platform -->
              <div class="space-y-1.5">
                <label for="link-platform-select" class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Platform <span class="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <div class="relative">
                  <select
                    id="link-platform-select"
                    formControlName="platform"
                    (change)="onPlatformChange()"
                    class="w-full px-4 py-2.5 text-sm rounded-xl min-h-[42px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer pr-10"
                    aria-label="Social Platform"
                  >
                    @for (opt of platformOptions; track opt.value) {
                      <option [value]="opt.value">{{ opt.label }}</option>
                    }
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                    <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Label -->
              <div class="space-y-1.5">
                <label for="link-label-input" class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Display Label <span class="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <input
                  id="link-label-input"
                  type="text"
                  formControlName="label"
                  placeholder="e.g. GitHub Profile"
                  class="w-full px-4 py-2.5 text-sm rounded-xl min-h-[42px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <!-- URL -->
              <div class="space-y-1.5">
                <label for="link-url-input" class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Target URL <span class="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <input
                  id="link-url-input"
                  type="url"
                  formControlName="url"
                  placeholder="https://github.com/username"
                  class="w-full px-4 py-2.5 text-sm rounded-xl min-h-[42px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <!-- Order and Visibility -->
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1.5">
                  <label for="link-order-input" class="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Display Order
                  </label>
                  <input
                    id="link-order-input"
                    type="number"
                    formControlName="order"
                    placeholder="0"
                    class="w-full px-4 py-2.5 text-sm rounded-xl min-h-[42px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div class="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 self-end min-h-[42px]">
                  <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Visible</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" formControlName="isVisible" class="sr-only peer" />
                    <div class="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 dark:bg-slate-700"></div>
                  </label>
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  (click)="closeModal()"
                  class="px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="isSaving()"
                  class="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow transition-all disabled:opacity-50"
                >
                  {{ isSaving() ? 'Saving...' : (editingLinkId ? 'Save Changes' : 'Create Link') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
})
export class SocialLinkListComponent implements OnInit, OnDestroy {
  private readonly portfolioService = inject(PortfolioService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);
  private syncSub?: Subscription;

  public readonly socialLinks = signal<SocialLink[]>([]);
  public readonly isLoading = signal<boolean>(true);
  public readonly isSaving = signal<boolean>(false);
  public readonly showModal = signal<boolean>(false);

  public editingLinkId: string | null = null;
  public readonly platformOptions = [
    { label: 'GitHub', value: 'github' },
    { label: 'LinkedIn', value: 'linkedin' },
    { label: 'Telegram', value: 'telegram' },
    { label: 'Facebook', value: 'facebook' },
    { label: 'Email', value: 'email' },
    { label: 'Twitter / X', value: 'twitter' },
    { label: 'YouTube', value: 'youtube' },
    { label: 'Other', value: 'other' },
  ];

  public readonly linkForm: FormGroup = this.fb.group({
    platform: ['github' as SocialPlatform, Validators.required],
    label: ['GitHub', Validators.required],
    url: ['', [Validators.required]],
    icon: ['github'],
    order: [0],
    isVisible: [true],
  });

  public ngOnInit(): void {
    let previousPlatform = this.linkForm.get('platform')?.value;
    this.linkForm.get('platform')?.valueChanges.subscribe((val) => {
      if (val === null && previousPlatform) {
        this.linkForm.get('platform')?.setValue(previousPlatform, { emitEvent: false });
      } else if (val !== null) {
        previousPlatform = val;
      }
    });

    this.loadSocialLinks();
    if (this.portfolioService?.dataMutated$) {
      this.syncSub = this.portfolioService.dataMutated$.subscribe((mutation) => {
        if (!mutation.type || mutation.type === 'social-link') {
          this.loadSocialLinks();
        }
      });
    }
  }

  @HostListener('window:focus')
  public onWindowFocus(): void {
    this.loadSocialLinks();
  }

  public ngOnDestroy(): void {
    this.syncSub?.unsubscribe();
  }

  public loadSocialLinks(): void {
    this.isLoading.set(true);
    this.portfolioService.getAdminSocialLinks().subscribe({
      next: (res) => {
        const raw = res.data as unknown;
        const items: SocialLink[] = Array.isArray(raw)
          ? (raw as SocialLink[])
          : ((raw as { items?: SocialLink[] })?.items ?? []);
        this.socialLinks.set(items);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notificationService.showError('Failed to load social links.');
      },
    });
  }

  public onPlatformChange(): void {
    const p = this.linkForm.get('platform')?.value;
    if (p && !this.editingLinkId) {
      const labels: Record<string, string> = {
        github: 'GitHub',
        linkedin: 'LinkedIn',
        telegram: 'Telegram',
        facebook: 'Facebook',
        email: 'Email Contact',
        twitter: 'Twitter / X',
        youtube: 'YouTube',
        other: 'Website',
      };
      this.linkForm.patchValue({
        label: labels[p] || 'Link',
        icon: p,
      });
    }
  }

  public openCreateModal(): void {
    this.editingLinkId = null;
    this.linkForm.reset({
      platform: 'github',
      label: 'GitHub',
      url: '',
      icon: 'github',
      order: this.socialLinks().length + 1,
      isVisible: true,
    });
    this.showModal.set(true);
  }

  public onEditClick(event: Event, link: SocialLink): void {
    event.stopPropagation();
    this.openEditModal(link);
  }

  public openEditModal(link: SocialLink): void {
    const rawId = link._id || (link as unknown as { id?: string }).id;
    this.editingLinkId = typeof rawId === 'object' && rawId !== null && '$oid' in (rawId as Record<string, unknown>)
      ? String((rawId as { $oid: unknown }).$oid)
      : String(rawId || '');
    let platformVal = (link.platform || 'other').toString().toLowerCase().trim() as SocialPlatform;
    if (platformVal === 'other') {
      const detected = this.getPlatformKey(link);
      if (detected !== 'other') {
        platformVal = detected as SocialPlatform;
      }
    }
    this.linkForm.patchValue({
      platform: platformVal,
      label: link.label,
      url: link.url,
      icon: link.icon || platformVal,
      order: link.order ?? 0,
      isVisible: link.isVisible !== false,
    });
    this.showModal.set(true);
  }

  public getPlatformKey(link: SocialLink): string {
    const p = (link.platform || '').toLowerCase();
    const l = (link.label || '').toLowerCase();
    const u = (link.url || '').toLowerCase();
    if (p === 'telegram' || p.includes('tele') || l.includes('telegram') || u.includes('t.me')) return 'telegram';
    if (p === 'github' || p.includes('git') || l.includes('github') || u.includes('github.com')) return 'github';
    if (p === 'linkedin' || p.includes('link') || l.includes('linkedin') || u.includes('linkedin.com')) return 'linkedin';
    if (p === 'facebook' || p.includes('face') || l.includes('facebook') || u.includes('facebook.com')) return 'facebook';
    if (p === 'twitter' || p === 'x' || p.includes('twit') || l.includes('twitter') || u.includes('x.com') || u.includes('twitter.com')) return 'twitter';
    if (p === 'youtube' || p.includes('yout') || l.includes('youtube') || u.includes('youtube.com')) return 'youtube';
    if (p === 'email' || p.includes('mail') || l.includes('email') || u.includes('mailto:')) return 'email';
    return p || 'other';
  }

  public getPlatformDisplay(link: SocialLink): string {
    const key = this.getPlatformKey(link);
    const names: Record<string, string> = {
      telegram: 'Telegram',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      facebook: 'Facebook',
      twitter: 'Twitter / X',
      youtube: 'YouTube',
      email: 'Email',
    };
    return names[key] || link.label || link.platform || 'Other';
  }

  public closeModal(): void {
    this.showModal.set(false);
    this.editingLinkId = null;
  }

  public toggleVisibility(link: SocialLink): void {
    const updated = !link.isVisible;
    this.portfolioService.updateAdminSocialLink(link._id, { isVisible: updated }).subscribe({
      next: () => {
        link.isVisible = updated;
        this.notificationService.showSuccess(`Link marked as ${updated ? 'visible' : 'hidden'}.`);
      },
      error: () => this.notificationService.showError('Failed to update visibility.'),
    });
  }

  public saveLink(): void {
    if (this.linkForm.invalid) {
      this.notificationService.showError('Please check form fields for errors.');
      return;
    }

    this.isSaving.set(true);
    const formVal = this.linkForm.value;

    const payload: Partial<SocialLink> = {
      platform: formVal.platform,
      label: formVal.label,
      url: formVal.url,
      icon: formVal.icon || formVal.platform,
      order: Number(formVal.order) || 0,
      isVisible: !!formVal.isVisible,
    };

    if (this.editingLinkId) {
      this.portfolioService.updateAdminSocialLink(this.editingLinkId, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.notificationService.showSuccess('Social link updated successfully!');
          this.loadSocialLinks();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.notificationService.showError(err?.error?.message || 'Failed to update social link.');
        },
      });
    } else {
      this.portfolioService.createAdminSocialLink(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.notificationService.showSuccess('Social link created successfully!');
          this.loadSocialLinks();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.notificationService.showError(err?.error?.message || 'Failed to create social link.');
        },
      });
    }
  }

  public onDeleteClick(event: Event, link: SocialLink): void {
    event.stopPropagation();
    this.onDelete(link);
  }

  public onDelete(link: SocialLink): void {
    const rawId = link._id || (link as unknown as { id?: string }).id;
    const linkId = typeof rawId === 'object' && rawId !== null && '$oid' in (rawId as Record<string, unknown>)
      ? String((rawId as { $oid: unknown }).$oid)
      : String(rawId || '');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Social Link',
        message: `Are you sure you want to remove link to "${link.label}" (${link.url})?`,
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        isDestructive: true,
      },
    });

    dialogRef?.afterClosed()?.subscribe((confirmed: boolean) => {
      if (confirmed && linkId) {
        this.portfolioService.deleteAdminSocialLink(linkId).subscribe({
          next: () => {
            this.notificationService.showSuccess('Social link deleted successfully.');
            this.loadSocialLinks();
          },
          error: (err) => {
            this.notificationService.showError(err?.error?.message || 'Failed to delete social link.');
          },
        });
      }
    });
  }
}
