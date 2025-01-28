import { Plan } from '../../types/subscription';
import { PaymentError } from './errors';
import { getPaymentSettings } from '../admin/paymentGateways';
import { processStripePayment } from './providers/stripe';
import { processPayPalPayment } from './providers/paypal';
import { processRazorpayPayment } from './providers/razorpay';

export interface PaymentGatewayStatus {
  stripe: boolean;
  paypal: boolean;
  razorpay: boolean;
}

export async function getActivePaymentGateways(): Promise<PaymentGatewayStatus> {
  try {
    const settings = await getPaymentSettings();
    return {
      stripe: settings?.stripe?.enabled || false,
      paypal: settings?.paypal?.enabled || false,
      razorpay: settings?.razorpay?.enabled || false
    };
  } catch (error) {
    console.error('Error getting payment gateways:', error);
    throw new PaymentError('Failed to get payment settings', 'settings_error');
  }
}

export async function processPayment(
  plan: Plan,
  paymentMethod: string,
  paymentData: any
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  try {
    const settings = await getPaymentSettings();
    if (!settings) {
      throw new PaymentError('Payment settings not found', 'settings_not_found');
    }

    // Check if the selected payment method is enabled
    if (
      (paymentMethod === 'stripe' && !settings.stripe?.enabled) ||
      (paymentMethod === 'paypal' && !settings.paypal?.enabled) ||
      (paymentMethod === 'razorpay' && !settings.razorpay?.enabled)
    ) {
      throw new PaymentError('Selected payment method is not enabled', 'gateway_disabled');
    }
    
    // Process payment based on selected method
    switch (paymentMethod) {
      case 'stripe':
        if (!settings.stripe?.enabled || !settings.stripe?.secretKey) {
          throw new PaymentError('Stripe is not properly configured', 'stripe_not_configured');
        }
        return processStripePayment(plan, paymentData, settings.stripe);
        
      case 'paypal':
        if (!settings.paypal?.enabled || !settings.paypal?.clientId) {
          throw new PaymentError('PayPal is not properly configured', 'paypal_not_configured');
        }
        return processPayPalPayment(plan, paymentData, settings.paypal);
        
      case 'razorpay':
        if (!settings.razorpay?.enabled || !settings.razorpay?.keyId) {
          throw new PaymentError('Razorpay is not properly configured', 'razorpay_not_configured');
        }
        return processRazorpayPayment(plan, paymentData, settings.razorpay);
        
      default:
        throw new PaymentError('Invalid payment method', 'invalid_method');
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    if (error instanceof PaymentError) {
      throw error;
    }
    throw new PaymentError('Payment processing failed', 'processing_error');
  }
}

export async function validatePaymentGateway(gateway: string): Promise<boolean> {
  try {
    const settings = await getPaymentSettings();
    if (!settings) return false;
    
    switch (gateway) {
      case 'stripe':
        return !!(settings.stripe?.enabled && settings.stripe?.secretKey && settings.stripe?.publishableKey);
      case 'paypal':
        return !!(settings.paypal?.enabled && settings.paypal?.clientId && settings.paypal?.clientSecret);
      case 'razorpay':
        return !!(settings.razorpay?.enabled && settings.razorpay?.keyId && settings.razorpay?.keySecret);
      default:
        return false;
    }
  } catch (error) {
    console.error('Gateway validation error:', error);
    return false;
  }
}