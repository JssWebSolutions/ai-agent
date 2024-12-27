import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { PricingTable } from './PricingTable';
import { UsageStats } from './UsageStats';
import { BillingHistory } from './BillingHistory';
import { Plan, Usage } from '../../types/subscription';
import { PLANS } from '../../services/subscription/plans';
import { getUsageStats } from '../../services/subscription/usage';
import { useToast } from '../../contexts/ToastContext';

export function SubscriptionPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState<Plan>(PLANS.free);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);

  // Get selected plan from navigation state
  const selectedPlan = location.state?.selectedPlan;
  const billingInterval = location.state?.billingInterval || 'monthly';

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const loadSubscriptionData = async () => {
      setLoading(true);
      try {
        const usageData = await getUsageStats(user.id);
        if (usageData) {
          setUsage(usageData);
        }
      } catch (error: any) {
        console.error('Error loading subscription data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load subscription data. Please try again.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptionData();
  }, [user, navigate, toast]);

  const handlePlanSelect = async (plan: Plan) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Handle plan selection logic here
    toast({
      title: 'Plan Selected',
      description: `You've selected the ${plan.name} plan. Implementation pending.`,
      type: 'info'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Subscription & Usage</h2>
        
        <PricingTable
          onSelectPlan={handlePlanSelect}
          currentPlan={currentPlan}
          billingInterval={billingInterval}
        />
      </div>

      {usage && <UsageStats usage={usage} plan={currentPlan} />}
      <BillingHistory invoices={[]} />
    </div>
  );
}