import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { COLLECTIONS } from './collections';
import { useAuth } from '../../contexts/AuthContext';

export async function checkCollections(): Promise<boolean> {
  try {
    const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'systemSettings');
    const settingsDoc = await getDoc(settingsRef);
    return settingsDoc.exists();
  } catch (error) {
    // Silently fail if permissions are not available
    return false;
  }
}

export async function initializeFirestoreCollections(): Promise<void> {
  try {
    const { user } = useAuth();
    
    // Only proceed if user is admin
    if (!user || user.role !== 'admin') {
      return;
    }

    // Initialize system settings
    const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'systemSettings');
    const settingsDoc = await getDoc(settingsRef);
    
    if (!settingsDoc.exists()) {
      await setDoc(settingsRef, {
        initialized: true,
        version: '1.0.0',
        lastUpdated: new Date()
      });
    }

    // Initialize user counts
    const userCountsRef = doc(db, COLLECTIONS.USER_COUNTS, 'userCount');
    const userCountsDoc = await getDoc(userCountsRef);
    
    if (!userCountsDoc.exists()) {
      await setDoc(userCountsRef, {
        total: 0,
        lastUpdated: new Date()
      });
    }
  } catch (error) {
    // Silently fail if permissions are not available
    console.debug('Collections initialization skipped - insufficient permissions');
  }
}