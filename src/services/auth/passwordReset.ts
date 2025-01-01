import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, actionCodeSettings } from '../../config/firebase';
import { AuthError } from './errors';

export async function sendPasswordReset(email: string): Promise<void> {
  // Define the password reset URL
  const passwordResetUrl = `${window.location.origin}/auth/reset-password`;

  try {
    // Construct the settings object for the password reset email
    const settings = {
      ...actionCodeSettings,
      url: passwordResetUrl // Use the manually defined URL here
    };

    // Send the password reset email
    await sendPasswordResetEmail(auth, email, settings);
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    
    // Handle different error codes from Firebase Authentication
    if (error.code === 'auth/unauthorized-continue-uri') {
      throw new AuthError(
        'Unable to send password reset email. Please try again later.',
        error.code
      );
    }
    if (error.code === 'auth/user-not-found') {
      throw new AuthError(
        'No account found with this email address',
        error.code
      );
    }
    if (error.code === 'auth/too-many-requests') {
      throw new AuthError(
        'Too many requests. Please try again in a few minutes.',
        error.code
      );
    }
    
    // Fallback error handling
    throw new AuthError(
      'Failed to send password reset email. Please try again.',
      error.code || 'auth/unknown'
    );
  }
}
