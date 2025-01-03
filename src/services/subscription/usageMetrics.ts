import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Usage } from '../../types/subscription';
import { getUserPlan } from './planUtils';

export async function getUsageStats(userId: string): Promise<Usage | null> {
  try {
    const usageRef = doc(db, 'usage', userId);
    const usageDoc = await getDoc(usageRef);
    
    if (!usageDoc.exists()) {
      const defaultUsage = createDefaultUsage(userId);
      await updateDoc(usageRef, defaultUsage);
      return defaultUsage;
    }

    return formatUsageData(usageDoc.data() as Usage);
  } catch (error) {
    console.error('Error getting usage stats:', error);
    return null;
  }
}

export async function incrementMessageCount(userId: string): Promise<boolean> {
  try {
    const usageRef = doc(db, 'usage', userId);
    const usageDoc = await getDoc(usageRef);
    const plan = await getUserPlan(userId);

    if (!plan) return false;

    const currentUsage = usageDoc.exists() ? usageDoc.data().metrics.totalMessages : 0;
    if (currentUsage >= plan.limits.messagesPerMonth) return false;

    await updateDoc(usageRef, {
      'metrics.totalMessages': increment(1)
    });

    return true;
  } catch (error) {
    console.error('Error incrementing message count:', error);
    return false;
  }
}

function createDefaultUsage(userId: string): Usage {
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

function formatUsageData(data: Usage): Usage {
  return {
    ...data,
    period: {
      start: new Date(data.period.start),
      end: new Date(data.period.end)
    }
  };
}