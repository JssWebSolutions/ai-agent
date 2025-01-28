import { useEffect } from 'react';

declare global {
  interface Window {
    paypal: any;
  }
}
import { Plan } from '../../../types/subscription';
import { LoadingSpinner } from '../../LoadingSpinner';

interface PayPalPaymentFormProps {
  plan: Plan;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  processing: boolean;
}

export function PayPalPaymentForm({ plan, onSubmit, onCancel, processing }: PayPalPaymentFormProps) {
  useEffect(() => {
    // Load PayPal SDK
    const loadPayPalScript = async () => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=USD`;
      script.async = true;

      script.onload = () => {
        if (window.paypal) {
          window.paypal.Buttons({
            createOrder: async () => {
              const response = await fetch('/api/create-paypal-order', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  planId: plan.id,
                  amount: plan.price.monthly
                }),
              });
              const order = await response.json();
              return order.id;
            },
            onApprove: async (data: any) => {
              await onSubmit({
                type: 'paypal',
                orderId: data.orderID
              });
            },
            onError: (err: any) => {
              console.error('PayPal error:', err);
            }
          }).render('#paypal-button-container');
        }
      };

      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    };

    loadPayPalScript();
  }, [plan, onSubmit]);

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Plan Details</h3>
        <div className="space-y-2">
          <p className="text-gray-700">{plan.name} Plan</p>
          <p className="text-2xl font-bold">${plan.price.monthly}/month</p>
        </div>
      </div>

      {processing ? (
        <div className="flex justify-center p-8">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div id="paypal-button-container" className="min-h-[150px]"></div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}