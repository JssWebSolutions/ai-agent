import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Usage } from '../../types/subscription';

export async function getUsageStats(userId: string): Promise<Usage | null> {
  try {
    // Get usage document directly using userId
    const usageRef = doc(db, 'usage', userId);
    const usageDoc = await getDoc(usageRef);
    
    if (!usageDoc.exists()) {
      // Return default usage stats if no document exists
      return {
        userId,
        period: {
          start: new Date(),
          end: new Date(new Date().setMonth(new Date().getMonth() + 1))
        },
        metrics: {
          totalMessages: 0,
          totalAgents: 0,
          storageUsed: 0
        },
        notifications: []
      };
    }

    return {
      ...usageDoc.data(),
      period: {
        start: usageDoc.data().period.start.toDate(),
        end: usageDoc.data().period.end.toDate()
      }
    } as Usage;
  } catch (error) {
    console.error('Error getting usage stats:', error);
    return null;
  }
}