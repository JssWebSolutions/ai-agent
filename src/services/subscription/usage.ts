import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Usage } from '../../types/subscription';
import { PLANS } from './plans';
import { User } from '../../types/auth';

export async function getUsageStats(userId: string): Promise<Usage | null> {
  if (!userId) return null;
  
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
      
      await setDoc(usageRef, {
        ...defaultUsage,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return defaultUsage;
    }

    const data = usageDoc.data();
    return {
      ...data,
      userId,
      period: {
        start: data.period.start.toDate(),
        end: data.period.end.toDate()
      }
    } as Usage;
  } catch (error) {
    console.error('Error getting usage stats:', error);
    return null;
  }
}

export async function canCreateAgent(userId: string): Promise<boolean> {
  if (!userId) return false;
  
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

export async function incrementMessageCount(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  try {
    const usageRef = doc(db, 'usage', userId);
    const userRef = doc(db, 'users', userId);
    
    const [usageDoc, userDoc] = await Promise.all([
      getDoc(usageRef),
      getDoc(userRef)
    ]);

    const user = userDoc.data() as User;
    const planId = user?.subscription?.planId || 'plan_free';
    const plan = Object.values(PLANS).find(p => p.id === planId);

    if (!plan) {
      console.error('Invalid subscription plan');
      return true; // Allow message to prevent blocking users
    }

    const currentUsage = usageDoc.exists() ? usageDoc.data().metrics.totalMessages : 0;

    // Check if user has exceeded their plan's message limit
    if (currentUsage >= plan.limits.messagesPerMonth) {
      return false;
    }

    // Create or update usage document
    if (!usageDoc.exists()) {
      await setDoc(usageRef, {
        userId,
        period: {
          start: new Date(),
          end: new Date(new Date().setMonth(new Date().getMonth() + 1))
        },
        metrics: {
          totalMessages: 1,
          totalAgents: 0,
          storageUsed: 0
        },
        notifications: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      await updateDoc(usageRef, {
        'metrics.totalMessages': increment(1),
        updatedAt: serverTimestamp()
      });
    }

    return true;
  } catch (error) {
    console.error('Error incrementing message count:', error);
    return true; // Allow message to prevent blocking users
  }
}