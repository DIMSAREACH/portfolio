import { Injectable } from '@angular/core';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  Auth,
} from 'firebase/auth';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;

  constructor() {
    this.initialize();
  }

  /**
   * Check whether Firebase credentials have been supplied in environment
   */
  public isConfigured(): boolean {
    const config = environment.firebase;
    return Boolean(
      config &&
      config.apiKey &&
      config.projectId &&
      !config.apiKey.includes('PLACEHOLDER'),
    );
  }

  /**
   * Safely initialize the Firebase Client App
   */
  private initialize(): void {
    if (!this.isConfigured()) {
      return;
    }

    try {
      const apps = getApps();
      if (apps.length > 0) {
        this.app = apps[0];
      } else {
        this.app = initializeApp(environment.firebase);
      }
      this.auth = getAuth(this.app);
    } catch (error) {
      console.warn('Failed to initialize Firebase Auth client:', error);
    }
  }

  /**
   * Authenticate with Firebase using Email and Password, returning the Firebase ID Token
   */
  public async signInWithEmail(email: string, password: string): Promise<string> {
    if (!this.isConfigured() || !this.auth) {
      throw new Error(
        'Firebase Authentication credentials have not been configured in frontend/src/environments/environment.ts yet.',
      );
    }

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      return idToken;
    } catch (error: unknown) {
      throw new Error(this.formatFirebaseError(error), { cause: error });
    }
  }

  /**
   * Send password reset email via Firebase Auth
   */
  public async sendPasswordReset(email: string): Promise<void> {
    if (!this.isConfigured() || !this.auth) {
      throw new Error(
        'Firebase Authentication credentials have not been configured yet.',
      );
    }

    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error: unknown) {
      throw new Error(this.formatFirebaseError(error), { cause: error });
    }
  }

  /**
   * Sign out from Firebase Auth client session
   */
  public async logout(): Promise<void> {
    if (this.auth) {
      try {
        await signOut(this.auth);
      } catch {
        // Silently continue
      }
    }
  }

  /**
   * Map Firebase error codes to user-friendly messages
   */
  public formatFirebaseError(error: unknown): string {
    const err = error as { code?: string; message?: string } | null;
    const code = err?.code || '';

    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Invalid email or password. Please verify your credentials.';
      case 'auth/invalid-email':
        return 'The email address format is invalid.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact your administrator.';
      case 'auth/too-many-requests':
        return 'Access temporarily disabled due to multiple failed login attempts. Please reset your password or try again later.';
      case 'auth/network-request-failed':
        return 'Network connection failed. Please check your internet connection.';
      default:
        return err?.message || 'An error occurred during Firebase authentication.';
    }
  }
}
