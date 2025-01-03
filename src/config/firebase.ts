import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getAuth, sendPasswordResetEmail as firebaseSendPasswordResetEmail } from 'firebase/auth';
import { env } from './env';

// Initialize Firebase App
const app = initializeApp({
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
  measurementId: env.firebase.measurementId
});

// Initialize Firestore with cache settings
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache()
});

// Initialize Firebase Auth
export const auth = getAuth(app);

// Configure Auth settings
auth.useDeviceLanguage();

// Define action code settings for password reset and email verification
export const actionCodeSettings = {
  url: window.location.origin,
  handleCodeInApp: true
};

// Function to send a password reset email
export const sendPasswordResetEmail = (email: string): Promise<void> => {
  const passwordResetUrl = `${window.location.origin}/auth/reset-password`;

  return firebaseSendPasswordResetEmail(auth, email, {
    url: passwordResetUrl
  });
};

// Additional URL settings for email verification
export const verifyEmailURL = `${window.location.origin}/auth/verify-email`;
