
import { useAuth } from '../../contexts/AuthContext';
import { Plan } from '../../types/subscription';
import { updateSubscription } from '../../services/subscription/subscriptionService';
import { useToast } from '../../contexts/ToastContext';
import { PaymentModal } from '../Payment/PaymentModal';

interface SubscriptionManagerProps {
  selectedPlan: Plan | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SubscriptionManager({ selectedPlan, isOpen, onClose, onSuccess }: SubscriptionManagerProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePaymentSuccess = async () => {
    if (!user || !selectedPlan) return;

    try {
      await updateSubscription(user.id, selectedPlan);
      toast({
        title: 'Success',
        description: 'Your subscription has been updated successfully',
        type: 'success'
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update subscription',
        type: 'error'
      });
    }
  };

  if (!selectedPlan || !isOpen) return null;

  return (
    <PaymentModal
      plan={selectedPlan}
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={handlePaymentSuccess}
    />
  );
}