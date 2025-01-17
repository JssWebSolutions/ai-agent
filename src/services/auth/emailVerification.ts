import {
  sendEmailVerification as firebaseSendEmailVerification,
  User as FirebaseUser,
} from 'firebase/auth';
import { actionCodeSettings } from '../../config/firebase';
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
    // Ensure we have valid action code settings
    const verifyEmailURL = `${window.location.origin}/auth/verify-email`;
    const settings = {
      ...actionCodeSettings,
      url: verifyEmailURL,
      handleCodeInApp: true
    };

    // Send the verification email using Firebase
    await firebaseSendEmailVerification(user, settings);
    lastEmailSentTimestamp = now; // Update timestamp after successful email sent
  } catch (error: any) {
    // Handle specific Firebase errors
    if (error.code === 'auth/invalid-continue-uri' || error.code === 'auth/missing-continue-uri') {
      throw new AuthError(
        'Email verification configuration error. Please contact support.',
        'auth/configuration-error'
      );
    }
    if (error.code === 'auth/requires-recent-login') {
      throw new AuthError(
        'Please sign out and sign in again to verify your email.',
        'auth/requires-recent-login'
      );
    }
    if (error.code === 'auth/too-many-requests') {
      throw new AuthError(
        'Too many requests. Please try again in a few minutes.',
        'auth/too-many-requests'
      );
    }
    if (error.code === 'auth/unauthorized-continue-uri') {
      throw new AuthError(
        'Invalid verification configuration. Please contact support.',
        'auth/unauthorized-continue-uri'
      );
    }

    // Generic error handler
    console.error('Email verification error:', error);
    throw new AuthError(
      'Failed to send verification email. Please try again later.',
      error.code || 'auth/unknown'
    );
  }
}