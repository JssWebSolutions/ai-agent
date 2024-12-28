import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Plan } from '../../types/subscription';
import { createPaymentIntent } from './stripe';

export async function updateSubscription(userId: string, plan: Plan): Promise<string> {
  try {
    // Create payment intent for the new plan
    const clientSecret = await createPaymentIntent(plan);

    // Update user's subscription info in Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'subscription.planId': plan.id,
      'subscription.updatedAt': new Date(),
      'subscription.status': 'active'
    });

    return clientSecret;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw new Error('Failed to update subscription');
  }
}