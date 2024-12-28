import { loadStripe } from '@stripe/stripe-js';
import { PaymentMethod, PaymentResult } from './types';
import { Plan } from '../../types/subscription';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export async function createPaymentIntent(plan: Plan): Promise<string> {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: plan.id, amount: plan.price.monthly })
    });
    
    const { clientSecret } = await response.json();
    return clientSecret;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to initialize payment');
  }
}

export async function processPayment(
  clientSecret: string,
  paymentMethod: PaymentMethod
): Promise<PaymentResult> {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to initialize');

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: paymentMethod.card!,
        billing_details: {}
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      transactionId: paymentIntent?.id
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}