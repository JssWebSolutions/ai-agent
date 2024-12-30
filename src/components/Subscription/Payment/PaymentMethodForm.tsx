import{ useState } from 'react';
import { CreditCard, PaypalIcon } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentMethodFormProps {
  onSubmit: (paymentMethod: string) => Promise<void>;
}

function PaymentForm({ onSubmit }: PaymentMethodFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      if (paymentMethod === 'card') {
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (error) {
          throw new Error(error.message);
        }

        await onSubmit(paymentMethod.id);
      } else {
        // Handle PayPal flow
        // Implementation would depend on your PayPal integration
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => setPaymentMethod('card')}
          className={`flex-1 py-3 px-4 rounded-lg border ${
            paymentMethod === 'card'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200'
          }`}
        >
          <CreditCard className="w-6 h-6 mx-auto mb-2" />
          <span className="block text-sm font-medium">Credit Card</span>
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod('paypal')}
          className={`flex-1 py-3 px-4 rounded-lg border ${
            paymentMethod === 'paypal'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200'
          }`}
        >
          <PaypalIcon className="w-6 h-6 mx-auto mb-2" />
          <span className="block text-sm font-medium">PayPal</span>
        </button>
      </div>

      {paymentMethod === 'card' && (
        <div className="p-4 border border-gray-200 rounded-lg">
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
      )}

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {processing ? 'Processing...' : 'Confirm Payment'}
      </button>
    </form>
  );
}

export function PaymentMethodForm(props: PaymentMethodFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}
