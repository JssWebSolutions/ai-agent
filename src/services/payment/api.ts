import { Plan } from '../../types/subscription';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function createPaymentIntent(plan: Plan): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/create-payment-intent`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_STRIPE_SECRET_KEY}`
      },
      body: JSON.stringify({ 
        planId: plan.id, 
        amount: plan.price.monthly,
        currency: 'usd'
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment intent');
    }
    
    const { clientSecret } = await response.json();
    return clientSecret;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to initialize payment. Please try again.');
  }
}