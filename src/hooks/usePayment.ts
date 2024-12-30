import { useState } from 'react';
import { Plan } from '../types/subscription';
import { createPaymentIntent, processPayment } from '../services/payment/stripe';
import { useToast } from '../contexts/ToastContext';
import { PaymentError } from '../services/payment/errors';

export function usePayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async (plan: Plan, paymentMethod: { card: any }) => {
    setIsProcessing(true);
    try {
      const clientSecret = await createPaymentIntent(plan);
      const result = await processPayment(clientSecret, paymentMethod);

      if (!result.success) {
        throw new PaymentError(
          result.error || 'Payment failed',
          'payment_failed'
        );
      }

      return result.transactionId;
    } catch (error) {
      if (error instanceof PaymentError) {
        toast({
          title: 'Payment Error',
          description: error.message,
          type: 'error'
        });
      } else {
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          type: 'error'
        });
      }
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handlePayment
  };
}