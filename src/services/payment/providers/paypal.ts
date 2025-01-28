import { Plan } from '../../../types/subscription';
import { PaymentError } from '../errors';

export async function processPayPalPayment(
  plan: Plan,
  paymentData: any,
  settings: { clientId: string; clientSecret: string; mode: 'sandbox' | 'live' }
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  try {
    if (!settings.clientId) {
      throw new PaymentError('PayPal configuration missing', 'paypal_config_missing');
    }

    // If we have an orderId, payment was already approved by PayPal
    if (paymentData.orderId) {
      return {
        success: true,
        transactionId: paymentData.orderId
      };
    }

    // This should not happen as we handle order creation in the PayPal button flow
    throw new PaymentError('Invalid PayPal payment data', 'invalid_paypal_data');

  } catch (error: any) {
    console.error('PayPal payment error:', error);
    return {
      success: false,
      error: error.message || 'PayPal payment processing failed'
    };
  }
}