import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Usage } from '../../types/subscription';
import { PLANS } from './plans';
import { User } from '../../types/auth';

export async function getUsageStats(userId: string): Promise<Usage | null> {
  try {
    const usageRef = doc(db, 'usage', userId);
    const usageDoc = await getDoc(usageRef);
    
    if (!usageDoc.exists()) {
      // Create default usage stats if none exist
      const defaultUsage: Usage = {
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
      
      await setDoc(usageRef, { ...defaultUsage });
      return defaultUsage;
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

export async function incrementMessageCount(userId: string): Promise<boolean> {
  try {
    const usageRef = doc(db, 'usage', userId);
    const userRef = doc(db, 'users', userId);
    
    const [usageDoc, userDoc] = await Promise.all([
      getDoc(usageRef),
      getDoc(userRef)
    ]);

    const user = userDoc.data() as User;
    const planId = user.subscription?.planId || 'plan_free';
    const plan = Object.values(PLANS).find(p => p.id === planId);

    if (!plan) {
      throw new Error('Invalid subscription plan');
    }

    const currentUsage = usageDoc.exists() ? usageDoc.data().metrics.totalMessages : 0;

    // Check if user has exceeded their plan's message limit
    if (currentUsage >= plan.limits.messagesPerMonth) {
      return false;
    }

    // Increment message count
    await updateDoc(usageRef, {
      'metrics.totalMessages': increment(1)
    });

    return true;
  } catch (error) {
    console.error('Error incrementing message count:', error);
    return false;
  }
}

export async function canCreateAgent(userId: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return false;
    }

    const user = userDoc.data() as User;
    const planId = user.subscription?.planId || 'plan_free';
    const plan = Object.values(PLANS).find(p => p.id === planId);

    if (!plan) {
      return false;
    }

    // Check if user has reached their plan's agent limit
    return user.agentCount < plan.limits.agentsPerAccount;
  } catch (error) {
    console.error('Error checking agent creation limit:', error);
    return false;
  }
}