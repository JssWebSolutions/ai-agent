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
  // Validate Stripe configuration
  if (!STRIPE_CONFIG.PUBLIC_KEY) {
    throw new PaymentError(
      'Payment system is not configured. Please check your Stripe configuration.',
      'stripe_not_configured'
    );
  }

  try {
    // Validate plan data
    if (!plan || !plan.price || !plan.price.monthly) {
      throw new PaymentError(
        'Invalid plan data provided',
        'invalid_plan_data'
      );
    }

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
    if (!clientSecret) {
      throw new PaymentError(
        'Invalid response from payment server',
        'invalid_response'
      );
    }

    return clientSecret;
  } catch (error) {
    if (error instanceof PaymentError) {
      throw error;
    }

    console.error('Payment initialization error:', error);
    throw new PaymentError(
      'Failed to initialize payment. Please check your connection and try again.',
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
      error: 'Payment system is not properly configured. Please check Stripe settings.'
    };
  }

  try {
    // Validate client secret
    if (!clientSecret) {
      throw new Error('Invalid payment session');
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: paymentMethod.card,
        billing_details: {}
      }
    });

    if (error) {
      console.error('Payment confirmation error:', error);
      return {
        success: false,
        error: error.message || 'Payment failed. Please try again.'
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
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during payment processing. Please try again.'
    };
  }
}