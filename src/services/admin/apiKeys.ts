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
    
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data();
    return {
      openai: data.openai ? await decrypt(data.openai) : undefined,
      gemini: data.gemini ? await decrypt(data.gemini) : undefined,
      updatedAt: data.updatedAt.toDate(),
      updatedBy: data.updatedBy
    };
  } catch (error) {
    console.error('Error getting API keys:', error);
    throw new Error('Failed to retrieve API keys');
  }
}

export async function updateAPIKeys(keys: Partial<APIKeys>, adminId: string): Promise<void> {
  try {
    const docRef = doc(db, 'settings', API_KEYS_DOC);
    const docSnap = await getDoc(docRef);
    
    const encryptedKeys = {
      ...(keys.openai && { openai: encrypt(keys.openai) }),
      ...(keys.gemini && { gemini: encrypt(keys.gemini) }),
      updatedAt: new Date(),
      updatedBy: adminId
    };

    if (docSnap.exists()) {
      await updateDoc(docRef, encryptedKeys);
    } else {
      await setDoc(docRef, encryptedKeys);
    }
  } catch (error) {
    console.error('Error updating API keys:', error);
    throw new Error('Failed to update API keys');
  }
}