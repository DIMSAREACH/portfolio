import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'right',
    verticalPosition: 'bottom',
  };

  /**
   * Display success notification
   */
  public success(message: string, action = 'Close', duration = 4000): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-success'],
    });
  }

  /**
   * Convenience alias for success notification
   */
  public showSuccess(message: string, action = 'Close', duration = 4000): void {
    this.success(message, action, duration);
  }

  /**
   * Display error notification
   */
  public error(message: string, action = 'Close', duration = 6000): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-error'],
    });
  }

  /**
   * Convenience alias for error notification
   */
  public showError(message: string, action = 'Close', duration = 6000): void {
    this.error(message, action, duration);
  }

  /**
   * Display warning notification
   */
  public warning(message: string, action = 'Close', duration = 5000): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-warning'],
    });
  }

  /**
   * Display informational notification
   */
  public info(message: string, action = 'Close', duration = 4000): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-info'],
    });
  }
}
