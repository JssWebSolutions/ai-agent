import { Plan } from '../../../types/subscription';
import { PaymentError } from '../errors';
import { loadStripe } from '@stripe/stripe-js';

export async function processStripePayment(
  plan: Plan,
  paymentData: any,
  settings: { publishableKey: string; secretKey: string }
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  try {
    if (!settings.publishableKey) {
      throw new PaymentError('Stripe configuration missing', 'stripe_config_missing');
    }

    const stripe = await loadStripe(settings.publishableKey);
    if (!stripe) {
      throw new PaymentError('Failed to initialize Stripe', 'stripe_init_failed');
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(paymentData.clientSecret, {
      payment_method: {
        card: paymentData.card,
        billing_details: paymentData.billingDetails || {}
      }
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    if (!paymentIntent) {
      return {
        success: false,
        error: 'Payment confirmation failed'
      };
    }

    return {
      success: true,
      transactionId: paymentIntent.id
    };
  } catch (error: any) {
    console.error('Stripe payment error:', error);
    return {
      success: false,
      error: error.message || 'Payment processing failed'
    };
  }
}