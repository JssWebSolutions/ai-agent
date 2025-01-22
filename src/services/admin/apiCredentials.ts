import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { decrypt } from '../encryption';

const SETTINGS_COLLECTION = 'settings';
const API_KEYS_DOC = 'api-keys';

interface APICredentials {
  key: string;
  provider: 'openai' | 'gemini';
  lastAccessed?: Date;
}

// In-memory cache with expiration
const credentialsCache = new Map<string, {
  credentials: APICredentials;
  expiresAt: number;
}>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getAPICredentials(provider: 'openai' | 'gemini'): Promise<string> {
  try {
    // Check cache first
    const cached = credentialsCache.get(provider);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.credentials.key;
    }

    // Clear expired cache
    credentialsCache.delete(provider);

    // Fetch from Firestore
    const docRef = doc(db, SETTINGS_COLLECTION, API_KEYS_DOC);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Please contact support to configure API settings');
    }

    const data = docSnap.data();
    const encryptedKey = data[provider];

    if (!encryptedKey) {
      throw new Error('Please contact support to configure API settings');
    }

    const key = await decrypt(encryptedKey);
    if (!key) {
      throw new Error('Please contact support to configure API settings');
    }

    // Cache the credentials
    credentialsCache.set(provider, {
      credentials: { key, provider },
      expiresAt: Date.now() + CACHE_DURATION
    });

    return key;
  } catch (error: any) {
    console.error('Error fetching API credentials:', error);
    throw new Error('Please contact support to configure API settings');
  }
}

export async function validateCredentials(provider: 'openai' | 'gemini', key: string): Promise<boolean> {
  try {
    if (provider === 'openai') {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${key}` }
      });
      return response.ok;
    } else {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
        headers: { 'x-goog-api-key': key }
      });
      return response.ok;
    }
  } catch (error) {
    console.error('API validation error:', error);
    return false;
  }
}

export function clearCredentials(provider?: 'openai' | 'gemini'): void {
  if (provider) {
    credentialsCache.delete(provider);
  } else {
    credentialsCache.clear();
  }
}

// Automatically clear expired credentials
setInterval(() => {
  const now = Date.now();
  for (const [provider, cached] of credentialsCache.entries()) {
    if (now >= cached.expiresAt) {
      credentialsCache.delete(provider);
    }
  }
}, 60000); // Check every minute