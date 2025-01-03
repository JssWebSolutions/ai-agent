import{ useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Plan } from '../../types/subscription';
import { PaymentForm } from './PaymentForm';
import { createPaymentIntent } from '../../services/payment/stripe';
import { useToast } from '../../contexts/ToastContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export interface PaymentModalProps {
  plan: Plan;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (transactionId: string) => void;
}

export function PaymentModal({ plan, isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      initializePayment();
    }
  }, [isOpen, plan]);

  const initializePayment = async () => {
    try {
      const secret = await createPaymentIntent(plan);
      setClientSecret(secret);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to initialize payment',
        type: 'error'
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Complete Your Purchase</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm
              plan={plan}
              clientSecret={clientSecret}
              onSuccess={onSuccess}
              onCancel={onClose}
            />
          </Elements>
        ) : (
          <div className="text-red-600">Failed to initialize payment</div>
        )}
      </div>
    </div>
  );
}