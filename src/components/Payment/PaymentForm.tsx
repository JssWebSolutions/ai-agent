import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Plan } from '../../types/subscription';
import { processPayment } from '../../services/payment/stripe';
import { useToast } from '../../contexts/ToastContext';

interface PaymentFormProps {
  plan: Plan;
  clientSecret: string;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

export function PaymentForm({ plan, clientSecret, onSuccess, onCancel }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Payment system is not ready. Please try again.');
      return;
    }

    if (!validateStripeConfig()) {
      setError('Invalid Stripe configuration.');
      return;
    }
    setProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw error;
      }

      const result = await processPayment(clientSecret, {
        card: paymentMethod!.card!
      });

      if (!result.success) {
        throw new Error(result.error || 'Payment failed');
      }

      toast({
        title: 'Payment Successful',
        description: 'Your subscription has been activated',
        type: 'success'
      });

      onSuccess(result.transactionId!);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Payment Failed',
        description: err.message,
        type: 'error'
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Plan Details</h3>
        <div className="space-y-2">
          <p className="text-gray-700">{plan.name} Plan</p>
          <p className="text-2xl font-bold">${plan.price.monthly}/month</p>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Card Details
        </label>
        <div className="p-4 border rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          disabled={processing}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
}

function validateStripeConfig(): boolean {
  // Define required environment variables or configurations
  const requiredConfig = [
    process.env.REACT_APP_STRIPE_PUBLIC_KEY,
    process.env.REACT_APP_STRIPE_SECRET_KEY,
    process.env.REACT_APP_STRIPE_WEBHOOK_SECRET,
  ];

  // Check if any required configuration is missing
  const missingConfig = requiredConfig.some((config) => !config);

  if (missingConfig) {
    console.error("Stripe configuration is incomplete. Please check your environment variables.");
    return false;
  }

  // Perform additional validation if needed (e.g., key formats)
  const publicKeyPattern = /^pk_live_/; // Example: public keys should start with 'pk_live_'
  if (!publicKeyPattern.test(process.env.REACT_APP_STRIPE_PUBLIC_KEY!)) {
    console.error("Invalid Stripe public key. Make sure it starts with 'pk_live_'.");
    return false;
  }

  // All validations passed
  return true;
}
