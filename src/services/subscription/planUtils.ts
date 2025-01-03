import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { PLANS } from './plans';
import { Plan } from '../../types/subscription';
import { User } from '../../types/auth';

export async function getUserPlan(userId: string): Promise<Plan | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return null;

    const user = userDoc.data() as User;
    const planId = user.subscription?.planId || 'plan_free';
    return Object.values(PLANS).find(p => p.id === planId) || null;
  } catch (error) {
    console.error('Error getting user plan:', error);
    return null;
  }
}

export async function canCreateAgent(userId: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return false;

    const user = userDoc.data() as User;
    const plan = await getUserPlan(userId);

    if (!plan) return false;

    return user.agentCount < plan.limits.agentsPerAccount;
  } catch (error) {
    console.error('Error checking agent creation limit:', error);
    return false;
  }
}