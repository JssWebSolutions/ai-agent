import {
  sendEmailVerification as firebaseSendEmailVerification,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, actionCodeSettings } from '../../config/firebase';
import { AuthError } from './errors';

let lastEmailSentTimestamp = 0;
const RATE_LIMIT_DURATION = 60000; // 1 minute

export async function sendVerificationEmail(user: FirebaseUser): Promise<void> {
  const now = Date.now();
  const timeElapsed = now - lastEmailSentTimestamp;

  // Check if the rate limit has been exceeded
  if (timeElapsed < RATE_LIMIT_DURATION) {
    const remainingSeconds = Math.ceil(
      (RATE_LIMIT_DURATION - timeElapsed) / 1000
    );
    throw new AuthError(
      `Please wait ${remainingSeconds} seconds before requesting another verification email.`,
      'auth/rate-limited'
    );
  }

  try {
    const settings = {
      ...actionCodeSettings,
      url: auth.config.verifyEmailURL,
    };

    // Send the verification email using Firebase
    await firebaseSendEmailVerification(user, settings);
    lastEmailSentTimestamp = now; // Update timestamp after successful email sent
  } catch (error) {
    // Check if the error is an instance of the native JavaScript Error
    if (error instanceof Error) {
      switch (error.message) {
        case 'auth/unauthorized-continue-uri':
          throw new AuthError(
            'Unable to send verification email. Please try again later.',
            error.message
          );
        case 'auth/too-many-requests':
          throw new AuthError(
            'Too many requests. Please try again in a few minutes.',
            error.message
          );
        default:
          throw new AuthError(
            'Failed to send verification email. Please try again.',
            error.message || 'auth/unknown'
          );
      }
    } else {
      // Handle other errors that may not be Firebase-specific
      throw new AuthError(
        'An unexpected error occurred. Please try again.',
        'auth/unknown'
      );
    }
  }
}
