import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Message } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared';

@Component({
  selector: 'app-admin-message-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fadeIn pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Communication Center
            </span>
            @if (unreadCount() > 0) {
              <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                {{ unreadCount() }} Unread
              </span>
            }
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Inquiries & Contact Messages
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage inquiries, project consultations, and hire requests submitted from your public portfolio.
          </p>
        </div>
      </div>

      <!-- Main Messages Container -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <!-- Filter Toolbar -->
        <div class="p-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="relative w-full sm:w-72">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchChange()"
              placeholder="Search sender, subject..."
              class="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Status Filters -->
          <div class="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              type="button"
              (click)="onFilterChange('all')"
              class="px-3 py-1.5 text-xs font-semibold rounded-xl transition-all"
              [class.bg-indigo-600]="activeFilter() === 'all'"
              [class.text-white]="activeFilter() === 'all'"
              [class.bg-slate-100]="activeFilter() !== 'all'"
              [class.dark:bg-slate-800]="activeFilter() !== 'all'"
              [class.text-slate-600]="activeFilter() !== 'all'"
              [class.dark:text-slate-300]="activeFilter() !== 'all'"
            >
              All Messages
            </button>
            <button
              type="button"
              (click)="onFilterChange('unread')"
              class="px-3 py-1.5 text-xs font-semibold rounded-xl transition-all"
              [class.bg-indigo-600]="activeFilter() === 'unread'"
              [class.text-white]="activeFilter() === 'unread'"
              [class.bg-slate-100]="activeFilter() !== 'unread'"
              [class.dark:bg-slate-800]="activeFilter() !== 'unread'"
              [class.text-slate-600]="activeFilter() !== 'unread'"
              [class.dark:text-slate-300]="activeFilter() !== 'unread'"
            >
              Unread Only
            </button>
            <button
              type="button"
              (click)="onFilterChange('read')"
              class="px-3 py-1.5 text-xs font-semibold rounded-xl transition-all"
              [class.bg-indigo-600]="activeFilter() === 'read'"
              [class.text-white]="activeFilter() === 'read'"
              [class.bg-slate-100]="activeFilter() !== 'read'"
              [class.dark:bg-slate-800]="activeFilter() !== 'read'"
              [class.text-slate-600]="activeFilter() !== 'read'"
              [class.dark:text-slate-300]="activeFilter() !== 'read'"
            >
              Read
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse" aria-label="Contact Inquiries Table">
            <thead>
              <tr class="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th scope="col" class="px-6 py-3.5">Status</th>
                <th scope="col" class="px-6 py-3.5">Sender</th>
                <th scope="col" class="px-6 py-3.5">Subject & Message Preview</th>
                <th scope="col" class="px-6 py-3.5">Received Date</th>
                <th scope="col" class="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              @if (isLoading()) {
                @for (_ of [1, 2, 3]; track $index) {
                  <tr class="animate-pulse">
                    <td class="px-6 py-4"><div class="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-12"></div></td>
                    <td class="px-6 py-4"><div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div></td>
                    <td class="px-6 py-4"><div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-64"></div></td>
                    <td class="px-6 py-4"><div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div></td>
                    <td class="px-6 py-4 text-right"><div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 ml-auto"></div></td>
                  </tr>
                }
              } @else if (messages().length === 0) {
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center text-slate-400">
                    No inquiries found.
                  </td>
                </tr>
              } @else {
                @for (msg of messages(); track msg._id) {
                  <tr
                    class="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    [class.bg-indigo-50/20]="!msg.isRead"
                    [class.dark:bg-indigo-950/20]="!msg.isRead"
                    (click)="openDetail(msg)"
                  >
                    <!-- Read/Unread Status Indicator -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      @if (!msg.isRead) {
                        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                          Unread
                        </span>
                      } @else {
                        <span class="text-slate-400 text-[11px]">Read</span>
                      }
                    </td>

                    <!-- Sender Name & Email -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="font-bold text-slate-900 dark:text-white" [class.font-black]="!msg.isRead">
                        {{ msg.name }}
                      </div>
                      <div class="text-[11px] text-slate-400">{{ msg.email }}</div>
                    </td>

                    <!-- Subject & Preview -->
                    <td class="px-6 py-4 max-w-md">
                      <div class="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {{ msg.subject }}
                      </div>
                      <div class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {{ msg.message }}
                      </div>
                    </td>

                    <!-- Date -->
                    <td class="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                      {{ msg.createdAt | date: 'mediumDate' }}
                    </td>

                    <!-- Actions -->
                    <td class="px-6 py-4 text-right whitespace-nowrap" (click)="$event.stopPropagation()">
                      <div class="inline-flex items-center gap-1">
                        <!-- Toggle Read/Unread -->
                        <button
                          type="button"
                          (click)="toggleReadStatus(msg)"
                          class="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          [title]="msg.isRead ? 'Mark as Unread' : 'Mark as Read'"
                          [attr.aria-label]="msg.isRead ? 'Mark as Unread' : 'Mark as Read'"
                        >
                          @if (msg.isRead) {
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          } @else {
                            <svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                            </svg>
                          }
                        </button>

                        <!-- Delete -->
                        <button
                          type="button"
                          (click)="onDelete(msg)"
                          class="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                          title="Delete Message"
                          aria-label="Delete message"
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

      <!-- Detail Modal -->
      @if (selectedMessage()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div class="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Inquiry Details
                </span>
                <h2 class="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {{ selectedMessage()?.subject }}
                </h2>
              </div>
              <button
                type="button"
                (click)="selectedMessage.set(null)"
                class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl leading-none"
                aria-label="Close dialog"
              >
                &times;
              </button>
            </div>

            <!-- Sender info card -->
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <span class="block font-bold text-slate-900 dark:text-white">{{ selectedMessage()?.name }}</span>
                <a [href]="'mailto:' + selectedMessage()?.email" class="text-indigo-600 dark:text-indigo-400 hover:underline">
                  {{ selectedMessage()?.email }}
                </a>
              </div>
              <div class="text-right text-slate-400">
                <div>{{ selectedMessage()?.createdAt | date: 'medium' }}</div>
                @if (selectedMessage()?.ipAddress) {
                  <div class="font-mono text-[10px]">IP: {{ selectedMessage()?.ipAddress }}</div>
                }
              </div>
            </div>

            <!-- Full Message Body -->
            <div class="space-y-2">
              <h3 class="text-xs font-bold text-slate-700 dark:text-slate-300">Message Body:</h3>
              <div class="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {{ selectedMessage()?.message }}
              </div>
            </div>

            <!-- Action buttons in modal -->
            <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <a
                [href]="'mailto:' + selectedMessage()?.email + '?subject=Re: ' + selectedMessage()?.subject"
                class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow transition-all"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Reply by Email</span>
              </a>

              <button
                type="button"
                (click)="selectedMessage.set(null)"
                class="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class MessageListComponent implements OnInit {
  private readonly portfolioService = inject(PortfolioService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  public readonly messages = signal<Message[]>([]);
  public readonly isLoading = signal<boolean>(true);
  public readonly activeFilter = signal<'all' | 'unread' | 'read'>('all');
  public readonly selectedMessage = signal<Message | null>(null);
  public readonly unreadCount = signal<number>(0);

  public searchQuery = '';

  public ngOnInit(): void {
    this.loadMessages();
  }

  public loadMessages(): void {
    this.isLoading.set(true);

    const params: {
      search?: string;
      isRead?: boolean;
    } = {};

    if (this.searchQuery.trim()) {
      params.search = this.searchQuery.trim();
    }

    if (this.activeFilter() === 'unread') {
      params.isRead = false;
    } else if (this.activeFilter() === 'read') {
      params.isRead = true;
    }

    this.portfolioService.getAdminMessages(params).subscribe({
      next: (res) => {
        const items = res.data.items || [];
        this.messages.set(items);
        this.unreadCount.set(items.filter((m) => !m.isRead).length);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notificationService.showError('Failed to load inquiries.');
      },
    });
  }

  public onSearchChange(): void {
    this.loadMessages();
  }

  public onFilterChange(filter: 'all' | 'unread' | 'read'): void {
    this.activeFilter.set(filter);
    this.loadMessages();
  }

  public openDetail(msg: Message): void {
    this.selectedMessage.set(msg);
    if (!msg.isRead) {
      this.portfolioService.markAdminMessageAsRead(msg._id).subscribe({
        next: () => {
          msg.isRead = true;
          this.unreadCount.update((c) => Math.max(0, c - 1));
        },
      });
    }
  }

  public toggleReadStatus(msg: Message): void {
    if (msg.isRead) {
      this.portfolioService.markAdminMessageAsUnread(msg._id).subscribe({
        next: () => {
          msg.isRead = false;
          this.unreadCount.update((c) => c + 1);
          this.notificationService.showSuccess('Marked as unread.');
        },
        error: () => this.notificationService.showError('Failed to update message status.'),
      });
    } else {
      this.portfolioService.markAdminMessageAsRead(msg._id).subscribe({
        next: () => {
          msg.isRead = true;
          this.unreadCount.update((c) => Math.max(0, c - 1));
          this.notificationService.showSuccess('Marked as read.');
        },
        error: () => this.notificationService.showError('Failed to update message status.'),
      });
    }
  }

  public onDelete(msg: Message): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Message',
        message: `Are you sure you want to permanently delete inquiry from "${msg.name}"?`,
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.portfolioService.deleteAdminMessage(msg._id).subscribe({
          next: () => {
            this.notificationService.showSuccess('Message deleted successfully.');
            if (this.selectedMessage()?._id === msg._id) {
              this.selectedMessage.set(null);
            }
            this.loadMessages();
          },
          error: (err) => {
            this.notificationService.showError(err?.error?.message || 'Failed to delete message.');
          },
        });
      }
    });
  }
}
