import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Usage } from '../../types/subscription';
import { PLANS } from './plans';

export async function trackUsage(
  userId: string,
  messageCount: number
): Promise<void> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  try {
    const usageRef = collection(db, 'usage');
    const usageQuery = query(
      usageRef,
      where('userId', '==', userId),
      where('period.start', '==', startOfMonth)
    );

    const snapshot = await getDocs(usageQuery);
    
    if (snapshot.empty) {
      // Create new usage record for this month
      await addDoc(usageRef, {
        userId,
        period: {
          start: Timestamp.fromDate(startOfMonth),
          end: Timestamp.fromDate(endOfMonth)
        },
        metrics: {
          totalMessages: messageCount,
          totalAgents: 0,
          storageUsed: 0
        },
        notifications: []
      });
    } else {
      const usageDoc = snapshot.docs[0];
      const currentUsage = usageDoc.data() as Usage;
      
      // Update existing usage record
      const newTotal = currentUsage.metrics.totalMessages + messageCount;
      
      // Check usage thresholds and send notifications
      const thresholds = [75, 90, 100];
      const userPlan = PLANS.starter; // This should come from user's actual plan
      
      for (const threshold of thresholds) {
        const limit = userPlan.limits.messagesPerMonth;
        const percentageUsed = (newTotal / limit) * 100;
        
        if (
          percentageUsed >= threshold &&
          !currentUsage.notifications.some(n => n.threshold === threshold)
        ) {
          // Send notification
          await sendUsageNotification(userId, threshold, newTotal, limit);
          
          // Record notification
          currentUsage.notifications.push({
            type: threshold >= 100 ? 'critical' : 'warning',
            threshold,
            sentAt: new Date()
          });
        }
      }
      
      await addDoc(usageRef, {
        ...currentUsage,
        metrics: {
          ...currentUsage.metrics,
          totalMessages: newTotal
        }
      });
    }
  } catch (error) {
    console.error('Error tracking usage:', error);
    throw error;
  }
}

async function sendUsageNotification(
  userId: string,
  threshold: number,
  current: number,
  limit: number
): Promise<void> {
  // Implementation for sending notifications (email, in-app, etc.)
  console.log(`Usage notification: ${threshold}% reached for user ${userId}`);
}

export async function getUsageStats(userId: string): Promise<Usage | null> {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const usageRef = collection(db, 'usage');
    const usageQuery = query(
      usageRef,
      where('userId', '==', userId),
      where('period.start', '==', startOfMonth)
    );
    
    const snapshot = await getDocs(usageQuery);
    return snapshot.empty ? null : snapshot.docs[0].data() as Usage;
  } catch (error) {
    console.error('Error getting usage stats:', error);
    throw error;
  }
}