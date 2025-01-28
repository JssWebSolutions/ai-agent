import { useState, useEffect } from 'react';
import { Plan } from '../../types/subscription';
import { PaymentProcessor } from './PaymentProcessor';
import { useToast } from '../../contexts/ToastContext';
import { validatePaymentGateway } from '../../services/payment/paymentService';

export interface PaymentModalProps {
  plan: Plan;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (transactionId: string) => void;
}

export function PaymentModal({ plan, isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const validatePayment = async () => {
      try {
        const isValid = await validatePaymentGateway('paypal');
        if (!isValid) {
          toast({
            title: 'Error',
            description: 'PayPal payment system is not properly configured',
            type: 'error'
          });
          onClose();
        }
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

    if (isOpen) {
      validatePayment();
    }
  }, [isOpen, onClose, toast]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Complete Your Purchase</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <PaymentProcessor
            plan={plan}
            onSuccess={onSuccess}
            onCancel={onClose}
          />
        )}
      </div>
    </div>
  );
}