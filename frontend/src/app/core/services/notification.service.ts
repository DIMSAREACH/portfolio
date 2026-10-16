import { Injectable, inject } from '@angular/core';
import { MessageService, ToastMessageOptions } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly messageService = inject(MessageService);

  /**
   * Display success toast notification
   */
  public success(message: string, actionOrSummary = 'Success', duration = 4000): void {
    const summary = actionOrSummary && actionOrSummary !== 'Close' && actionOrSummary !== 'OK' ? actionOrSummary : 'Success';
    this.messageService.add({
      severity: 'success',
      summary,
      detail: message,
      life: duration,
    });
  }

  /**
   * Convenience alias for success toast notification
   */
  public showSuccess(message: string, actionOrSummary = 'Success', duration = 4000): void {
    this.success(message, actionOrSummary, duration);
  }

  /**
   * Display error toast notification
   */
  public error(message: string, actionOrSummary = 'Error', duration = 6000): void {
    const summary = actionOrSummary && actionOrSummary !== 'Close' && actionOrSummary !== 'OK' ? actionOrSummary : 'Error';
    this.messageService.add({
      severity: 'error',
      summary,
      detail: message,
      life: duration,
    });
  }

  /**
   * Convenience alias for error toast notification
   */
  public showError(message: string, actionOrSummary = 'Error', duration = 6000): void {
    this.error(message, actionOrSummary, duration);
  }

  /**
   * Display warning toast notification
   */
  public warning(message: string, actionOrSummary = 'Warning', duration = 5000): void {
    const summary = actionOrSummary && actionOrSummary !== 'Close' && actionOrSummary !== 'OK' ? actionOrSummary : 'Warning';
    this.messageService.add({
      severity: 'warn',
      summary,
      detail: message,
      life: duration,
    });
  }

  /**
   * Convenience alias for warning toast notification
   */
  public showWarning(message: string, actionOrSummary = 'Warning', duration = 5000): void {
    this.warning(message, actionOrSummary, duration);
  }

  /**
   * Display informational toast notification
   */
  public info(message: string, actionOrSummary = 'Information', duration = 4000): void {
    const summary = actionOrSummary && actionOrSummary !== 'Close' && actionOrSummary !== 'OK' ? actionOrSummary : 'Information';
    this.messageService.add({
      severity: 'info',
      summary,
      detail: message,
      life: duration,
    });
  }

  /**
   * Convenience alias for info toast notification
   */
  public showInfo(message: string, actionOrSummary = 'Information', duration = 4000): void {
    this.info(message, actionOrSummary, duration);
  }

  /**
   * Display custom toast notification with full PrimeNG options
   */
  public showToast(options: ToastMessageOptions): void {
    this.messageService.add(options);
  }

  /**
   * Clear all active toasts or toasts with a specific key
   */
  public clear(key?: string): void {
    this.messageService.clear(key);
  }
}
