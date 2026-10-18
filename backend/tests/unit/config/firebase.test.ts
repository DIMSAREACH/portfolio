import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { isFirebaseConfigured, verifyFirebaseIdToken } from '../../../src/config/firebase';
import config from '../../../src/config/environment';
import { BadRequestError, UnauthorizedError } from '../../../src/utils/AppError';

describe('Firebase Configuration & Verification Module', () => {
  const originalProjectId = config.FIREBASE_PROJECT_ID;
  const originalClientEmail = config.FIREBASE_CLIENT_EMAIL;
  const originalPrivateKey = config.FIREBASE_PRIVATE_KEY;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    (config as any).FIREBASE_PROJECT_ID = originalProjectId;
    (config as any).FIREBASE_CLIENT_EMAIL = originalClientEmail;
    (config as any).FIREBASE_PRIVATE_KEY = originalPrivateKey;
  });

  it('should detect when Firebase credentials are not fully configured', () => {
    (config as any).FIREBASE_PROJECT_ID = '';
    (config as any).FIREBASE_CLIENT_EMAIL = '';
    (config as any).FIREBASE_PRIVATE_KEY = '';

    expect(isFirebaseConfigured()).toBe(false);
  });

  it('should detect when Firebase credentials are fully configured', () => {
    (config as any).FIREBASE_PROJECT_ID = 'test-project';
    (config as any).FIREBASE_CLIENT_EMAIL = 'test-client@test-project.iam.gserviceaccount.com';
    (config as any).FIREBASE_PRIVATE_KEY = 'test-private-key';

    expect(isFirebaseConfigured()).toBe(true);
  });

  it('should throw BadRequestError when token is missing or not a string', async () => {
    await expect(verifyFirebaseIdToken('')).rejects.toThrow(BadRequestError);
    await expect(verifyFirebaseIdToken(null as any)).rejects.toThrow(BadRequestError);
  });

  it('should throw UnauthorizedError when Firebase credentials are not configured', async () => {
    (config as any).FIREBASE_PROJECT_ID = '';
    (config as any).FIREBASE_CLIENT_EMAIL = '';
    (config as any).FIREBASE_PRIVATE_KEY = '';

    await expect(verifyFirebaseIdToken('valid-looking-token')).rejects.toThrow(
      UnauthorizedError,
    );
  });
});
