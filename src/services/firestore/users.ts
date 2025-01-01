import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { User } from '../../types/auth';
import { COLLECTIONS } from '../database/collections';
import { userConverter } from './converters';

export async function getAllUsers(): Promise<User[]> {
  try {
    const usersRef = collection(db, COLLECTIONS.USERS).withConverter(userConverter);
    const querySnapshot = await getDocs(usersRef);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}
