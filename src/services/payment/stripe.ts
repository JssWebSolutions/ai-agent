import { loadStripe, Stripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from './config';
import { PaymentError } from './errors';
import { Plan } from '../../types/subscription';

// Initialize Stripe only if public key is available
let stripePromise: Promise<Stripe | null> | null = null;

const getStripe = () => {
  if (!stripePromise && STRIPE_CONFIG.PUBLIC_KEY) {
    stripePromise = loadStripe(STRIPE_CONFIG.PUBLIC_KEY);
  }
  return stripePromise;
};

export async function createPaymentIntent(plan: Plan): Promise<string> {
  if (!STRIPE_CONFIG.PUBLIC_KEY) {
    throw new PaymentError(
      'Payment system is not configured. Please try again later.',
      'stripe_not_configured'
    );
  }

  try {
    const response = await fetch(`${STRIPE_CONFIG.API_URL}${STRIPE_CONFIG.ENDPOINTS.CREATE_INTENT}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRIPE_CONFIG.PUBLIC_KEY}`
      },
      body: JSON.stringify({
        planId: plan.id,
        amount: plan.price.monthly,
        currency: 'usd'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new PaymentError(
        error.message || 'Failed to create payment intent',
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

    throw new PaymentError(
      'Failed to initialize payment. Please try again.',
      'payment_failed'
    );
  }
}

export async function processPayment(
  clientSecret: string,
  paymentMethod: { card: any }
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  const stripe = await getStripe();
  
  if (!stripe) {
    return {
      success: false,
      error: 'Payment system is not configured'
    };
  }

  try {
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: paymentMethod.card,
        billing_details: {}
      }
    });

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    return {
      success: true,
      transactionId: paymentIntent?.id
    };
  } catch (error) {
    return {
      success: false,
      error: 'An unexpected error occurred during payment processing'
    };
  }
}