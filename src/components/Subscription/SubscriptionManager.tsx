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

export function SubscriptionManager({
  selectedPlan,
  isOpen,
  onClose,
  onSuccess,
}: SubscriptionManagerProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePaymentSuccess = async () => {
    if (!user || !selectedPlan) {
      toast({
        title: 'Error',
        description: 'User or plan information is missing.',
        type: 'error',
      });
      return;
    }

    try {
      await updateSubscription(user.id, selectedPlan);
      toast({
        title: 'Success',
        description: `Your subscription to the ${selectedPlan.name} plan has been updated successfully.`,
        type: 'success',
      });
      onSuccess(); // Notify parent component of success
    } catch (error: any) {
      console.error('Subscription update failed:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update subscription. Please try again later.',
        type: 'error',
      });
    }
  };

  if (!selectedPlan || !isOpen) {
    return null; // Do not render the modal if the required props are not provided
  }

  return (
    <PaymentModal
      plan={selectedPlan}
      isOpen={isOpen}
      onClose={onClose}
      onSuccess={handlePaymentSuccess} // Ensure consistent prop usage
      />
  );
}
