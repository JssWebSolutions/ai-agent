import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Usage } from '../../types/subscription';
import { PLANS } from './plans';

export async function getUsageStats(userId: string): Promise<Usage | null> {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const usageRef = collection(db, 'usage');
    const usageQuery = query(
      usageRef,
      where('userId', '==', userId),
      where('period.start', '>=', startOfMonth)
    );
    
    const snapshot = await getDocs(usageQuery);
    
    if (snapshot.empty) {
      // Create initial usage record if none exists
      const initialUsage: Usage = {
        userId,
        period: {
          start: startOfMonth,
          end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
        },
        metrics: {
          totalMessages: 0,
          totalAgents: 0,
          storageUsed: 0
        },
        notifications: []
      };

      const docRef = await addDoc(usageRef, {
        ...initialUsage,
        period: {
          start: Timestamp.fromDate(startOfMonth),
          end: Timestamp.fromDate(new Date(now.getFullYear(), now.getMonth() + 1, 0))
        }
      });

      return initialUsage;
    }

    return snapshot.docs[0].data() as Usage;
  } catch (error) {
    console.error('Error getting usage stats:', error);
    throw error;
  }
}