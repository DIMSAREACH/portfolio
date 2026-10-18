import { TestBed } from '@angular/core/testing';
import { FirebaseAuthService } from './firebase-auth.service';

describe('FirebaseAuthService', () => {
  let service: FirebaseAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseAuthService],
    });
    service = TestBed.inject(FirebaseAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should report isConfigured() = false when environment credentials are empty', () => {
    expect(service.isConfigured()).toBe(false);
  });

  it('should throw an informative error when attempting to sign in without configured credentials', async () => {
    await expect(
      service.signInWithEmail('admin@portfolio.dev', 'password123'),
    ).rejects.toThrow(/Firebase Authentication credentials have not been configured/);
  });

  it('should throw an informative error when attempting to send password reset without configured credentials', async () => {
    await expect(
      service.sendPasswordReset('admin@portfolio.dev'),
    ).rejects.toThrow(/Firebase Authentication credentials have not been configured/);
  });

  it('should format Firebase error codes into user-friendly messages', () => {
    expect(service.formatFirebaseError({ code: 'auth/invalid-credential' })).toBe(
      'Invalid email or password. Please verify your credentials.',
    );
    expect(service.formatFirebaseError({ code: 'auth/wrong-password' })).toBe(
      'Invalid email or password. Please verify your credentials.',
    );
    expect(service.formatFirebaseError({ code: 'auth/user-not-found' })).toBe(
      'Invalid email or password. Please verify your credentials.',
    );
    expect(service.formatFirebaseError({ code: 'auth/invalid-email' })).toBe(
      'The email address format is invalid.',
    );
    expect(service.formatFirebaseError({ code: 'auth/user-disabled' })).toBe(
      'This account has been disabled. Please contact your administrator.',
    );
    expect(service.formatFirebaseError({ code: 'auth/too-many-requests' })).toBe(
      'Access temporarily disabled due to multiple failed login attempts. Please reset your password or try again later.',
    );
    expect(service.formatFirebaseError({ code: 'auth/network-request-failed' })).toBe(
      'Network connection failed. Please check your internet connection.',
    );
    expect(service.formatFirebaseError({ message: 'Custom unexpected error' })).toBe(
      'Custom unexpected error',
    );
  });
});
