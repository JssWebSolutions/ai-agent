import { doc, getDoc, setDoc, updateDoc, DocumentData } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { User } from '../../types/auth';
import { PLANS } from '../subscription/plans';
import { COLLECTIONS } from '../database/collections';

export async function createUserDocument(userId: string, userData: Omit<User, 'id'>): Promise<void> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const subscription = {
      planId: PLANS.free.id,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(userRef, {
      ...userData,
      subscription,
      createdAt: new Date(),
      lastLogin: new Date(),
      updatedAt: new Date(),
      role: userData.role || 'user', // Ensure role is set
      agentCount: 0 // Initialize agent count
    });
  } catch (error) {
    console.error('Error creating user document:', error);
    throw new Error('Failed to create user account');
  }
}

export async function getUserDocument(userId: string): Promise<User | null> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return null;
    }

    const data = userDoc.data() as DocumentData;

    // Ensure all necessary fields are extracted from the document and converted properly
    const user: User = {
      id: userDoc.id,
      email: data.email || '',
      name: data.name || '',
      role: data.role || 'user', // Default to 'user' if role is not provided
      agentCount: data.agentCount || 0,
      emailVerified: data.emailVerified || false,
      createdAt: data.createdAt?.toDate() || new Date(),
      lastLogin: data.lastLogin?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      profileImage: data.profileImage || null,
      subscription: data.subscription || null
    };

    return user;
  } catch (error) {
    console.error('Error getting user document:', error);
    return null;
  }
}

export async function updateUserDocument(userId: string, data: Partial<User>): Promise<void> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user document:', error);
    throw new Error('Failed to update user profile');
  }
}

export async function setUserAsAdmin(userId: string): Promise<void> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      role: 'admin',
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error setting user as admin:', error);
    throw new Error('Failed to update user role');
  }
}

export async function updateUserAgentCount(userId: string, change: number): Promise<void> {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const currentCount = userDoc.data().agentCount || 0;
    await updateDoc(userRef, {
      agentCount: Math.max(0, currentCount + change),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user agent count:', error);
    // Don't throw as this is a non-critical operation
  }
}