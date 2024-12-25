import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
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

// Initialize Firebase Authentication action handlers
const actionCodeSettings = {
  url: window.location.origin,
  handleCodeInApp: true
};

auth.config.authDomain = window.location.hostname;
auth.config.passwordResetURL = `${window.location.origin}/auth/reset-password`;
auth.config.verifyEmailURL = `${window.location.origin}/auth/verify-email`;

export { actionCodeSettings };
