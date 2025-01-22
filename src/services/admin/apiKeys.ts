import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { encrypt, decrypt } from '../encryption';

const SETTINGS_COLLECTION = 'settings';
const API_KEYS_DOC = 'api-keys';

interface APIKeys {
  openai?: string;
  gemini?: string;
  updatedAt: Date;
  updatedBy: string;
}

export async function getAPIKeys(): Promise<APIKeys | null> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, API_KEYS_DOC);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    const decryptedKeys: APIKeys = {
      updatedAt: data.updatedAt?.toDate() || new Date(),
      updatedBy: data.updatedBy || ''
    };

    // Safely decrypt each key if it exists
    if (data.openai) {
      const decryptedOpenAI = await decrypt(data.openai);
      if (decryptedOpenAI) {
        decryptedKeys.openai = decryptedOpenAI;
      }
    }

    if (data.gemini) {
      const decryptedGemini = await decrypt(data.gemini);
      if (decryptedGemini) {
        decryptedKeys.gemini = decryptedGemini;
      }
    }

    return decryptedKeys;
  } catch (error) {
    console.error('Error getting API keys:', error);
    throw error;
  }
}

export async function updateAPIKeys(keys: Partial<APIKeys>, adminId: string): Promise<void> {
  if (!adminId) {
    throw new Error('Admin ID is required');
  }

  try {
    const docRef = doc(db, SETTINGS_COLLECTION, API_KEYS_DOC);
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
      updatedBy: adminId
    };

    // Only encrypt and update keys that have values
    if (keys.openai !== undefined) {
      updateData.openai = keys.openai ? await encrypt(keys.openai) : null;
    }
    
    if (keys.gemini !== undefined) {
      updateData.gemini = keys.gemini ? await encrypt(keys.gemini) : null;
    }

    await setDoc(docRef, updateData, { merge: true });
  } catch (error) {
    console.error('Error updating API keys:', error);
    throw new Error('Failed to update API keys. Please try again.');
  }
}