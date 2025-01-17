export const STRIPE_CONFIG = {
  PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
  API_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  ENDPOINTS: {
    CREATE_INTENT: '/create-payment-intent',
    SUBSCRIPTIONS: '/subscriptions'
  },
  ERROR_MESSAGES: {
    MISSING_KEY: 'Stripe public key is not configured',
    INTENT_FAILED: 'Failed to create payment intent',
    NETWORK_ERROR: 'Network error occurred while processing payment',
    GENERIC_ERROR: 'An error occurred while processing your payment'
  }
};