import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PricingTable } from './PricingTable';
import { UsageStats } from './UsageStats';
import { BillingHistory } from './BillingHistory';
import { Plan, Usage, Invoice } from '../../types/subscription';
import { PLANS } from '../../services/subscription/plans';
import { getUsageStats } from '../../services/subscription/usage';

export function SubscriptionPage() {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<Plan>(PLANS.free);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    if (user) {
      // Load user's subscription data
      const loadSubscriptionData = async () => {
        try {
          const usageData = await getUsageStats(user.id);
          if (usageData) {
            setUsage(usageData);
          }
          // Load invoices and other data here
        } catch (error) {
          console.error('Error loading subscription data:', error);
        }
      };
      loadSubscriptionData();
    }
  }, [user]);

  const handlePlanSelect = async (plan: Plan) => {
    // Implement plan selection logic
    console.log('Selected plan:', plan);
  };

  if (!user || !usage) {
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
        
        {/* Billing Interval Toggle */}
        <div className="flex justify-end mb-6">
          <div className="inline-flex rounded-lg border border-gray-200">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                billingInterval === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('annual')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                billingInterval === 'annual'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        {/* Pricing Table */}
        <PricingTable
          onSelectPlan={handlePlanSelect}
          currentPlan={currentPlan}
          billingInterval={billingInterval}
        />
      </div>

      {/* Usage Stats */}
      <UsageStats usage={usage} plan={currentPlan} />

      {/* Billing History */}
      <BillingHistory invoices={invoices} />
    </div>
  );
}