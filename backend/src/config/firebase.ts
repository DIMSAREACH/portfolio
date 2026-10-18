import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import config from './environment';
import logger from '../utils/logger';
import { BadRequestError, UnauthorizedError } from '../utils/AppError';

let firebaseInitialized = false;

/**
 * Checks whether Firebase Admin credentials have been configured
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    config.FIREBASE_PROJECT_ID &&
    config.FIREBASE_CLIENT_EMAIL &&
    config.FIREBASE_PRIVATE_KEY,
  );
}

/**
 * Initialize Firebase Admin SDK if configured
 */
export function initializeFirebaseAdmin(): App | null {
  const apps = getApps();
  if (firebaseInitialized && apps.length > 0) {
    return apps[0];
  }

  if (isFirebaseConfigured()) {
    try {
      const privateKey = (config.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
      const app = initializeApp({
        credential: cert({
          projectId: config.FIREBASE_PROJECT_ID,
          clientEmail: config.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      });
      firebaseInitialized = true;
      logger.info('Firebase Admin SDK initialized successfully');
      return app;
    } catch (error) {
      logger.error('Failed to initialize Firebase Admin SDK:', error);
      return null;
    }
  } else {
    logger.warn(
      'Firebase Admin credentials not configured in environment. Firebase Auth will operate in unconfigured mode.',
    );
    return null;
  }
}

// Auto-initialize on import
initializeFirebaseAdmin();

/**
 * Verify a Firebase ID token sent from the frontend client
 */
export async function verifyFirebaseIdToken(
  idToken: string,
): Promise<DecodedIdToken> {
  if (!idToken || typeof idToken !== 'string') {
    throw new BadRequestError('Firebase ID token is required');
  }

  const apps = getApps();
  if (!isFirebaseConfigured() || apps.length === 0) {
    throw new UnauthorizedError(
      'Firebase Authentication is not yet configured with service credentials on this server. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your backend .env file.',
    );
  }

  try {
    const auth = getAuth(apps[0]);
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.warn(`Firebase token verification failed: ${errorMsg}`);
    throw new UnauthorizedError('Invalid or expired Firebase authentication token');
  }
}

export { DecodedIdToken };
