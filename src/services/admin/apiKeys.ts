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
      return {
        updatedAt: new Date(),
        updatedBy: ''
      };
    }
    
    const data = docSnap.data();
    
    // Initialize with non-sensitive data
    const decryptedKeys: APIKeys = {
      updatedAt: data.updatedAt?.toDate() || new Date(),
      updatedBy: data.updatedBy || ''
    };

    // Safely decrypt each key if it exists
    if (data.openai) {
      try {
        const decrypted = await decrypt(data.openai);
        if (decrypted) {
          decryptedKeys.openai = decrypted;
        }
      } catch (error) {
        console.error('Error decrypting OpenAI key:', error);
      }
    }

    if (data.gemini) {
      try {
        const decrypted = await decrypt(data.gemini);
        if (decrypted) {
          decryptedKeys.gemini = decrypted;
        }
      } catch (error) {
        console.error('Error decrypting Gemini key:', error);
      }
    }

    return decryptedKeys;
  } catch (error) {
    console.error('Error getting API keys:', error);
    throw new Error('Failed to retrieve API keys. Please try again later.');
  }
}

export async function updateAPIKeys(keys: Partial<APIKeys>, adminId: string): Promise<void> {
  if (!adminId) {
    throw new Error('Admin ID is required to update API keys');
  }

  try {
    const docRef = doc(db, 'settings', API_KEYS_DOC);
    const docSnap = await getDoc(docRef);
    
    // Prepare the update data
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
      updatedBy: adminId
    };

    // Only encrypt and update provided keys that are not empty
    if (typeof keys.openai === 'string') {
      const trimmed = keys.openai.trim();
      updateData.openai = trimmed ? await encrypt(trimmed) : null;
    }
    
    if (typeof keys.gemini === 'string') {
      const trimmed = keys.gemini.trim();
      updateData.gemini = trimmed ? await encrypt(trimmed) : null;
    }

    if (docSnap.exists()) {
      await updateDoc(docRef, updateData);
    } else {
      await setDoc(docRef, updateData);
    }
  } catch (error) {
    console.error('Error updating API keys:', error);
    throw new Error('Failed to update API keys. Please ensure all values are valid and try again.');
  }
}