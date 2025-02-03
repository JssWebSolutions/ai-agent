import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PricingTable } from './PricingTable';
import { UsageStats } from './UsageStats';
import { BillingHistory } from './BillingHistory';
import { Plan, Usage } from '../../types/subscription';
import { PLANS } from '../../services/subscription/plans';
import { getUsageStats } from '../../services/subscription/usage';
import { useToast } from '../../contexts/ToastContext';
import { PaymentModal } from '../Payment/PaymentModal';
import { getPaymentSettings } from '../../services/admin/paymentGateways';

export function SubscriptionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState<Usage | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [usageData, paymentSettings] = await Promise.all([
          getUsageStats(user.id),
          getPaymentSettings(),
        ]);

        if (!paymentSettings || !Object.values(paymentSettings).some((gateway) => gateway?.enabled)) {
          toast({
            title: 'Payment Not Available',
            description: 'Payment system is not configured. Please contact support.',
            type: 'error',
          });
        }

        if (usageData) {
          setUsage(usageData);
        }
      } catch (error: any) {
        console.error('Error loading subscription data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load subscription data. Please try again.',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate, toast]);

  const handlePlanSelect = async (plan: Plan) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      toast({
        title: 'Success',
        description: 'Your subscription has been updated successfully',
        type: 'success'
      });
      setIsPaymentModalOpen(false);
      navigate('/user');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update subscription',
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900">Subscription & Usage</h2>
        <p className="mt-2 text-lg text-gray-600">Choose the plan that's right for you</p>

        <div className="mt-12 space-y-12">
          <PricingTable
            onSelectPlan={handlePlanSelect}
            currentPlan={PLANS[user?.subscription?.planId as keyof typeof PLANS || 'free']}
          />
          
          {usage && (
            <div className="bg-white rounded-lg shadow p-6">
              <UsageStats 
                usage={usage} 
                plan={PLANS[user?.subscription?.planId as keyof typeof PLANS || 'free']} 
              />
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow">
            <BillingHistory invoices={[]} />
          </div>
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}