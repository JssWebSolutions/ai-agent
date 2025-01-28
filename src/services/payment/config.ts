export const PAYMENT_CONFIG = {
  STRIPE: {
    PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
    API_URL: import.meta.env.VITE_API_BASE_URL || '/api',
    ENDPOINTS: {
      CREATE_INTENT: '/create-payment-intent',
      SUBSCRIPTIONS: '/subscriptions'
    }
  },
  PAYPAL: {
    CLIENT_ID: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
    SCRIPT_URL: 'https://www.paypal.com/sdk/js'
  },
  RAZORPAY: {
    KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
    SCRIPT_URL: 'https://checkout.razorpay.com/v1/checkout.js'
  }
};

export function validatePaymentConfig(provider: 'stripe' | 'paypal' | 'razorpay'): boolean {
  switch (provider) {
    case 'stripe':
      return !!PAYMENT_CONFIG.STRIPE.PUBLIC_KEY;
    case 'paypal':
      return !!PAYMENT_CONFIG.PAYPAL.CLIENT_ID;
    case 'razorpay':
      return !!PAYMENT_CONFIG.RAZORPAY.KEY_ID;
    default:
      return false;
  }
}

export function loadPaymentScript(provider: 'paypal' | 'razorpay'): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    
    switch (provider) {
      case 'paypal':
        script.src = `${PAYMENT_CONFIG.PAYPAL.SCRIPT_URL}?client-id=${PAYMENT_CONFIG.PAYPAL.CLIENT_ID}&currency=USD`;
        break;
      case 'razorpay':
        script.src = PAYMENT_CONFIG.RAZORPAY.SCRIPT_URL;
        break;
    }

    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${provider} script`));

    document.body.appendChild(script);
  });
}