import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    if (!error) {
      return;
    }

    // 1. Handle HttpErrorResponse
    if (error instanceof HttpErrorResponse) {
      console.error('[GlobalErrorHandler] HTTP Error:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        message: error.message,
        error: error.error,
      });
      return;
    }

    // 2. Handle standard Error instance
    if (error instanceof Error) {
      console.error('[GlobalErrorHandler] Uncaught Error:', error.message, '\nStack:', error.stack);
      if (error.cause) {
        console.error('[GlobalErrorHandler] Error Cause:', error.cause);
      }
      return;
    }

    // 3. Handle plain object errors (prevents "[object Object]" in browser console)
    if (typeof error === 'object' && error !== null) {
      const errObj = error as Record<string, unknown>;
      const message =
        errObj['message'] ||
        errObj['error'] ||
        errObj['statusText'] ||
        'Unspecified error object';
      console.error('[GlobalErrorHandler] Error Object:', message, error);
      try {
        console.error(
          '[GlobalErrorHandler] Error Details:',
          JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
        );
      } catch {
        console.error('[GlobalErrorHandler] Error Keys:', Object.keys(error));
      }
      return;
    }

    // 4. Fallback for primitive values
    console.error('[GlobalErrorHandler] Unhandled Error:', error);
  }
}
