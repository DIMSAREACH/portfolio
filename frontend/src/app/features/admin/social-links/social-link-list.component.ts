import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SocialLink, SocialPlatform } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared';

@Component({
  selector: 'app-admin-social-link-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
          class="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 self-start sm:self-auto"
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
              <tr class="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th scope="col" class="px-6 py-3.5">Platform</th>
                <th scope="col" class="px-6 py-3.5">Label</th>
                <th scope="col" class="px-6 py-3.5">Target Destination URL</th>
                <th scope="col" class="px-6 py-3.5 text-center">Visibility</th>
                <th scope="col" class="px-6 py-3.5 text-center">Order</th>
                <th scope="col" class="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
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
                    <td class="px-6 py-4 font-bold text-slate-900 dark:text-white capitalize flex items-center gap-2">
                      <span class="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-[10px]">
                        {{ link.platform.slice(0, 2).toUpperCase() }}
                      </span>
                      <span>{{ link.platform }}</span>
                    </td>

                    <td class="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                      {{ link.label }}
                    </td>

                    <td class="px-6 py-4 font-mono text-slate-500 max-w-xs truncate">
                      <a [href]="link.url" target="_blank" rel="noopener noreferrer" class="hover:text-indigo-600 dark:hover:text-indigo-400 underline decoration-slate-300 dark:decoration-slate-700">
                        {{ link.url }}
                      </a>
                    </td>

                    <td class="px-6 py-4 text-center">
                      <button
                        type="button"
                        (click)="toggleVisibility(link)"
                        class="px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors"
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

                    <td class="px-6 py-4 text-center text-slate-600 dark:text-slate-400 font-mono">
                      {{ link.order ?? 0 }}
                    </td>

                    <td class="px-6 py-4 text-right whitespace-nowrap">
                      <div class="inline-flex items-center gap-1">
                        <button
                          type="button"
                          (click)="openEditModal(link)"
                          class="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
                          title="Edit"
                          aria-label="Edit link"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          (click)="onDelete(link)"
                          class="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                          title="Delete"
                          aria-label="Delete link"
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
              <div class="space-y-1">
                <label for="link-platform-select" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Platform <span class="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <select
                  id="link-platform-select"
                  formControlName="platform"
                  (change)="onPlatformChange()"
                  class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  <option value="github">GitHub</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="facebook">Facebook</option>
                  <option value="email">Email</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="youtube">YouTube</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <!-- Label -->
              <div class="space-y-1">
                <label for="link-label-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Display Label <span class="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <input
                  id="link-label-input"
                  type="text"
                  formControlName="label"
                  placeholder="e.g. GitHub Profile"
                  class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <!-- URL -->
              <div class="space-y-1">
                <label for="link-url-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target URL <span class="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <input
                  id="link-url-input"
                  type="url"
                  formControlName="url"
                  placeholder="https://github.com/username"
                  class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <!-- Order and Visibility -->
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label for="link-order-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Display Order
                  </label>
                  <input
                    id="link-order-input"
                    type="number"
                    formControlName="order"
                    placeholder="0"
                    class="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div class="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 self-end">
                  <span class="text-xs font-semibold text-slate-700 dark:text-slate-300">Visible</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" formControlName="isVisible" class="sr-only peer" />
                    <div class="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 dark:bg-slate-700"></div>
                  </label>
                </div>
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
export class SocialLinkListComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  public readonly socialLinks = signal<SocialLink[]>([]);
  public readonly isLoading = signal<boolean>(true);
  public readonly isSaving = signal<boolean>(false);
  public readonly showModal = signal<boolean>(false);

  public editingLinkId: string | null = null;

  public readonly linkForm: FormGroup = this.fb.group({
    platform: ['github' as SocialPlatform, Validators.required],
    label: ['GitHub', Validators.required],
    url: ['', [Validators.required]],
    icon: ['github'],
    order: [0],
    isVisible: [true],
  });

  public ngOnInit(): void {
    this.loadSocialLinks();
  }

  public loadSocialLinks(): void {
    this.isLoading.set(true);
    this.portfolioService.getAdminSocialLinks().subscribe({
      next: (res) => {
        this.socialLinks.set(res.data || []);
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

  public openEditModal(link: SocialLink): void {
    this.editingLinkId = link._id;
    this.linkForm.patchValue({
      platform: link.platform,
      label: link.label,
      url: link.url,
      icon: link.icon || link.platform,
      order: link.order ?? 0,
      isVisible: link.isVisible !== false,
    });
    this.showModal.set(true);
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

  public onDelete(link: SocialLink): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Social Link',
        message: `Are you sure you want to remove link to "${link.label}" (${link.url})?`,
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.portfolioService.deleteAdminSocialLink(link._id).subscribe({
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
