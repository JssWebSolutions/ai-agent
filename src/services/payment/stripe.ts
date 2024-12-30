import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from './config';
import { PaymentError } from './errors';
import { Plan } from '../../types/subscription';

const stripePromise = loadStripe(STRIPE_CONFIG.PUBLIC_KEY);

export async function createPaymentIntent(plan: Plan): Promise<string> {
  if (!STRIPE_CONFIG.PUBLIC_KEY) {
    throw new PaymentError(
      STRIPE_CONFIG.ERROR_MESSAGES.MISSING_KEY,
      'missing_key'
    );
  }

  try {
    const response = await fetch(`${STRIPE_CONFIG.API_URL}${STRIPE_CONFIG.ENDPOINTS.CREATE_INTENT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId: plan.id,
        amount: plan.price.monthly,
        currency: 'usd'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new PaymentError(
        error.message || STRIPE_CONFIG.ERROR_MESSAGES.INTENT_FAILED,
        'intent_failed',
        response.status
      );
    }

    const { clientSecret } = await response.json();
    return clientSecret;
  } catch (error) {
    if (error instanceof PaymentError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new PaymentError(
        STRIPE_CONFIG.ERROR_MESSAGES.NETWORK_ERROR,
        'network_error'
      );
    }

    throw new PaymentError(
      STRIPE_CONFIG.ERROR_MESSAGES.GENERIC_ERROR,
      'unknown_error'
    );
  }
}

export async function processPayment(
  clientSecret: string,
  paymentMethod: { card: any }
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new PaymentError(
        STRIPE_CONFIG.ERROR_MESSAGES.MISSING_KEY,
        'missing_key'
      );
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: paymentMethod.card,
        billing_details: {}
      }
    });

    if (error) {
      throw new PaymentError(error.message, 'payment_failed');
    }

    return {
      success: true,
      transactionId: paymentIntent?.id
    };
  } catch (error) {
    if (error instanceof PaymentError) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: false,
      error: STRIPE_CONFIG.ERROR_MESSAGES.GENERIC_ERROR
    };
  }
}