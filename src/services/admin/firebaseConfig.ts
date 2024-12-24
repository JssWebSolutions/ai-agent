import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

type ConfigType = 'auth' | 'firestore' | 'storage' | 'rules';

export async function updateFirebaseConfig(type: ConfigType, config: any): Promise<void> {
  try {
    const configRef = doc(db, 'settings', 'firebase-config');
    await updateDoc(configRef, {
      [type]: config,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error(`Error updating ${type} configuration:`, error);
    throw new Error(`Failed to update ${type} configuration`);
  }
}
