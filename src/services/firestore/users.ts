import { collection, getDocs, query, where } from 'firebase/firestore';
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

export async function getUsersWithSubscriptions(): Promise<User[]> {
  try {
    const usersRef = collection(db, COLLECTIONS.USERS).withConverter(userConverter);
    const querySnapshot = await getDocs(usersRef);
    
    const users = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const userData = doc.data();
      
      // Get subscription data if it exists
      if (userData.subscription?.planId) {
        const subscriptionRef = collection(db, 'subscriptions');
        const subscriptionQuery = query(
          subscriptionRef,
          where('userId', '==', doc.id),
          where('status', '==', 'active')
        );
        const subscriptionSnapshot = await getDocs(subscriptionQuery);
        const subscription = subscriptionSnapshot.docs[0]?.data();
        
        if (subscription) {
          return {
            ...userData,
            id: doc.id,
            subscription: {
              ...userData.subscription,
              status: subscription.status,
              currentPeriodEnd: subscription.currentPeriodEnd?.toDate()
            }
          };
        }
      }
      
      return { ...userData, id: doc.id };
    }));

    return users;
  } catch (error) {
    console.error('Error fetching users with subscriptions:', error);
    throw new Error('Failed to fetch users with subscription data');
  }
}
