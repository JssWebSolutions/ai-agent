import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Plan } from '../../types/subscription';
import { getPaymentSettings } from '../admin/paymentGateways';
import { PaymentError } from '../payment/errors';
import { createPaymentIntent } from '../payment/api';

export async function updateSubscription(userId: string, plan: Plan): Promise<string> {
  try {
    // Get payment gateway settings
    const paymentSettings = await getPaymentSettings();
    if (!paymentSettings) {
      throw new PaymentError('Payment gateway not configured', 'gateway_not_configured');
    }

    // Check which payment gateway is enabled
    const activeGateway = 
      paymentSettings.stripe?.enabled ? 'stripe' :
      paymentSettings.paypal?.enabled ? 'paypal' :
      paymentSettings.razorpay?.enabled ? 'razorpay' : null;

    if (!activeGateway) {
      throw new PaymentError('No payment gateway enabled', 'no_gateway_enabled');
    }

    // Create payment intent based on active gateway
    let clientSecret;
    switch (activeGateway) {
      case 'stripe':
        if (!paymentSettings.stripe?.secretKey) {
          throw new PaymentError('Stripe not properly configured', 'stripe_not_configured');
        }
        clientSecret = await createPaymentIntent(plan);
        break;
      // Add cases for other payment gateways as needed
      default:
        throw new PaymentError('Selected payment gateway not supported', 'unsupported_gateway');
    }

    // Update user's subscription info in Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'subscription.planId': plan.id,
      'subscription.updatedAt': new Date(),
      'subscription.status': 'active',
      'subscription.paymentGateway': activeGateway
    });

    return clientSecret;
  } catch (error) {
    console.error('Error updating subscription:', error);
    if (error instanceof PaymentError) {
      throw error;
    }
    throw new PaymentError('Failed to update subscription', 'update_failed');
  }
}

export async function getActivePaymentGateway(userId: string): Promise<string | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return null;
    }

    return userDoc.data()?.subscription?.paymentGateway || null;
  } catch (error) {
    console.error('Error getting active payment gateway:', error);
    return null;
  }
}