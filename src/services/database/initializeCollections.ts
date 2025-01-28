import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { COLLECTIONS } from './collections';

export async function initializeFirestoreCollections() {
  try {
    // Initialize collections with their first documents
    await Promise.all([
      initializeSettings(),
      initializeUserCounts(),
      initializeUsage(),
    ]);

    console.log('Firestore collections initialized successfully');
  } catch (error) {
    console.error('Error initializing Firestore collections:', error);
    // Don't throw the error to prevent app crash
    return false;
  }
}

async function initializeSettings() {
  try {
    const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'api-keys');
    const settingsDoc = await getDoc(settingsRef);

    if (!settingsDoc.exists()) {
      await setDoc(settingsRef, {
        openai: null,
        gemini: null,
        updatedAt: serverTimestamp(),
        updatedBy: 'system'
      });
    }

    // Initialize payment settings
    const paymentSettingsRef = doc(db, COLLECTIONS.SETTINGS, 'payment-settings');
    const paymentDoc = await getDoc(paymentSettingsRef);

    if (!paymentDoc.exists()) {
      await setDoc(paymentSettingsRef, {
        stripe: {
          enabled: false,
          publishableKey: null,
          secretKey: null,
          webhookSecret: null
        },
        paypal: {
          enabled: false,
          clientId: null,
          clientSecret: null,
          mode: 'sandbox'
        },
        razorpay: {
          enabled: false,
          keyId: null,
          keySecret: null,
          webhookSecret: null
        },
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
}

async function initializeUserCounts() {
  try {
    const countRef = doc(db, COLLECTIONS.USER_COUNTS, 'total');
    const countDoc = await getDoc(countRef);

    if (!countDoc.exists()) {
      await setDoc(countRef, {
        count: 0,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error initializing user counts:', error);
  }
}

async function initializeUsage() {
  try {
    const usageRef = collection(db, COLLECTIONS.USAGE);
    const templateRef = doc(usageRef, 'template');
    const templateDoc = await getDoc(templateRef);

    if (!templateDoc.exists()) {
      await setDoc(templateRef, {
        period: {
          start: serverTimestamp(),
          end: serverTimestamp()
        },
        metrics: {
          totalMessages: 0,
          totalAgents: 0,
          storageUsed: 0
        },
        notifications: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error initializing usage:', error);
  }
}

// Function to check if collections exist
export async function checkCollections(): Promise<boolean> {
  try {
    const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'api-keys');
    const countRef = doc(db, COLLECTIONS.USER_COUNTS, 'total');
    const usageRef = doc(db, COLLECTIONS.USAGE, 'template');

    const [settingsDoc, countDoc, usageDoc] = await Promise.all([
      getDoc(settingsRef),
      getDoc(countRef),
      getDoc(usageRef)
    ]);

    return settingsDoc.exists() && countDoc.exists() && usageDoc.exists();
  } catch (error) {
    console.error('Error checking collections:', error);
    return false;
  }
}