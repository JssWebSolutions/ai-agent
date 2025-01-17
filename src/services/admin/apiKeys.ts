import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { encrypt, decrypt } from '../encryption';

const API_KEYS_DOC = 'api-keys';

interface APIKeys {
  openai?: string;
  gemini?: string;
  updatedAt: Date;
  updatedBy: string;
}

export async function getAPIKeys(): Promise<APIKeys | null> {
  try {
    const docRef = doc(db, 'settings', API_KEYS_DOC);
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
      try {
        const decryptedOpenAI = await decrypt(data.openai);
        if (decryptedOpenAI) {
          decryptedKeys.openai = decryptedOpenAI;
        }
      } catch (error) {
        console.error('Error decrypting OpenAI key:', error);
      }
    }

    if (data.gemini) {
      try {
        const decryptedGemini = await decrypt(data.gemini);
        if (decryptedGemini) {
          decryptedKeys.gemini = decryptedGemini;
        }
      } catch (error) {
        console.error('Error decrypting Gemini key:', error);
      }
    }

    return decryptedKeys;
  } catch (error) {
    console.error('Error getting API keys:', error);
    return null;
  }
}

export async function updateAPIKeys(keys: Partial<APIKeys>, adminId: string): Promise<void> {
  if (!adminId) {
    throw new Error('Admin ID is required');
  }

  try {
    const docRef = doc(db, 'settings', API_KEYS_DOC);
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

    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, updateData);
    } else {
      await setDoc(docRef, updateData);
    }
  } catch (error) {
    console.error('Error updating API keys:', error);
    throw new Error('Failed to update API keys. Please try again.');
  }
}