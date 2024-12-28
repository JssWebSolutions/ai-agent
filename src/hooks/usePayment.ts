import { useState } from 'react';
import { Plan } from '../types/subscription';
import { generateReceipt, sendReceiptEmail } from '../services/payment/receipt';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

export function usePayment() {
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePaymentSuccess = async (transactionId: string, plan: Plan) => {
    setProcessing(true);
    try {
      // Generate and send receipt
      await generateReceipt(transactionId, plan);
      if (user?.email) {
        await sendReceiptEmail(user.email, transactionId);
      }

      toast({
        title: 'Success',
        description: 'Your subscription has been activated',
        type: 'success'
      });

      // Redirect to success page
      navigate('/subscription/success', {
        state: { plan, transactionId }
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to process subscription. Please contact support.',
        type: 'error'
      });
    } finally {
      setProcessing(false);
    }
  };

  return {
    processing,
    handlePaymentSuccess
  };
}