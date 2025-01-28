import { useState } from 'react';
import { Plan } from '../../../types/subscription';
import { CardElement } from '@stripe/react-stripe-js';
import { LoadingSpinner } from '../../LoadingSpinner';

interface StripePaymentFormProps {
  plan: Plan;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  processing: boolean;
}

export function StripePaymentForm({ plan, onSubmit, onCancel, processing }: StripePaymentFormProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    await onSubmit({ type: 'card' });
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
          disabled={processing}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {processing ? (
            <>
              <LoadingSpinner />
              Processing...
            </>
          ) : (
            'Pay Now'
          )}
        </button>
      </div>
    </form>
  );
}