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
      throw new PaymentError('Payment system is not configured. Please contact support.', 'payment_not_configured');
    }

    // Check which payment gateway is enabled
    const activeGateway = 
      paymentSettings.stripe?.enabled ? 'stripe' :
      paymentSettings.paypal?.enabled ? 'paypal' :
      paymentSettings.razorpay?.enabled ? 'razorpay' : null;

    if (!activeGateway) {
      throw new PaymentError('No payment gateway is currently available. Please try again later.', 'no_gateway_enabled');
    }

    // Create payment intent based on active gateway
    let clientSecret;
    switch (activeGateway) {
      case 'stripe':
        if (!paymentSettings.stripe?.secretKey) {
          throw new PaymentError('Payment system configuration error. Please contact support.', 'stripe_not_configured');
        }
        clientSecret = await createPaymentIntent(plan);
        break;
      // Add cases for other payment gateways as needed
      default:
        throw new PaymentError('Selected payment gateway is not supported', 'unsupported_gateway');
    }

    // Update user's subscription info in Firestore
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new PaymentError('User not found', 'user_not_found');
    }

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
    throw new PaymentError('Failed to update subscription. Please try again later.', 'update_failed');
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