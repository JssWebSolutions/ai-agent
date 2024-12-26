import { loadStripe } from '@stripe/stripe-js';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { User } from '../../types/auth';
import { Plan, Subscription } from '../../types/subscription';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export async function createSubscription(
  user: User,
  plan: Plan,
  paymentMethodId: string
): Promise<Subscription> {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to initialize');

    // Create subscription on your backend
    const response = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        planId: plan.id,
        paymentMethodId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create subscription');
    }

    const subscription = await response.json();

    // Update user document with subscription info
    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, {
      subscription: {
        id: subscription.id,
        planId: plan.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    });

    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

export async function updateSubscription(
  subscriptionId: string,
  planId: string
): Promise<Subscription> {
  try {
    const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planId })
    });

    if (!response.ok) {
      throw new Error('Failed to update subscription');
    }

    return response.json();
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

export async function cancelSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = true
): Promise<void> {
  try {
    await fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cancelAtPeriodEnd })
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

export async function retryFailedPayment(
  subscriptionId: string,
  paymentMethodId: string
): Promise<void> {
  try {
    await fetch(`/api/subscriptions/${subscriptionId}/retry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentMethodId })
    });
  } catch (error) {
    console.error('Error retrying payment:', error);
    throw error;
  }
}