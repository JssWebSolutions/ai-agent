import { useState, useEffect } from 'react';
import { Plan } from '../../types/subscription';
import { PaymentGatewaySelector } from './PaymentGatewaySelector';
import { StripePaymentForm } from './providers/StripePaymentForm';
import { PayPalPaymentForm } from './providers/PayPalPaymentForm';
import { RazorpayPaymentForm } from './providers/RazorpayPaymentForm';
import { processPayment } from '../../services/payment/paymentService';
import { useToast } from '../../contexts/ToastContext';
import { loadPaymentScript } from '../../services/payment/config';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentProcessorProps {
  plan: Plan;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

export function PaymentProcessor({ plan, onSuccess, onCancel }: PaymentProcessorProps) {
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedGateway === 'paypal' || selectedGateway === 'razorpay') {
      loadPaymentScript(selectedGateway)
        .then(() => setScriptLoaded(true))
        .catch((error) => {
          console.error(`Failed to load ${selectedGateway} script:`, error);
          toast({
            title: 'Error',
            description: `Failed to initialize ${selectedGateway} payment`,
            type: 'error'
          });
        });
    }
  }, [selectedGateway, toast]);

  const handlePayment = async (paymentData: any) => {
    if (!selectedGateway) {
      toast({
        title: 'Error',
        description: 'Please select a payment method',
        type: 'error'
      });
      return;
    }

    setProcessing(true);
    try {
      const result = await processPayment(plan, selectedGateway, paymentData);
      
      if (!result.success || !result.transactionId) {
        throw new Error(result.error || 'Payment failed');
      }

      toast({
        title: 'Success',
        description: 'Payment processed successfully',
        type: 'success'
      });

      onSuccess(result.transactionId);
    } catch (error: any) {
      toast({
        title: 'Payment Failed',
        description: error.message || 'Failed to process payment',
        type: 'error'
      });
    } finally {
      setProcessing(false);
    }
  };

  const renderPaymentForm = () => {
    if (!selectedGateway || (selectedGateway !== 'stripe' && !scriptLoaded)) {
      return null;
    }

    switch (selectedGateway) {
      case 'stripe':
        return (
          <Elements stripe={stripePromise}>
            <StripePaymentForm
              plan={plan}
              onSubmit={handlePayment}
              onCancel={onCancel}
              processing={processing}
            />
          </Elements>
        );
      case 'paypal':
        return (
          <PayPalPaymentForm
            plan={plan}
            onSubmit={handlePayment}
            onCancel={onCancel}
            processing={processing}
          />
        );
      case 'razorpay':
        return (
          <RazorpayPaymentForm
            plan={plan}
            onSubmit={handlePayment}
            onCancel={onCancel}
            processing={processing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <PaymentGatewaySelector
        selectedGateway={selectedGateway}
        onSelect={setSelectedGateway}
      />

      {renderPaymentForm()}
    </div>
  );
}