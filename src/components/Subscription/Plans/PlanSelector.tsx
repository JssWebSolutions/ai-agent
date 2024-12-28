import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlanCard } from './PlanCard';
import { Plan } from '../../../types/subscription';
import { PLANS } from '../../../services/subscription/plans';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';

export function PlanSelector() {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const plans = Object.values(PLANS);

  const handleSelectPlan = (plan: Plan) => {
    if (!user) {
      // Redirect to auth if not logged in
      navigate('/auth', { 
        state: { 
          returnTo: '/subscription',
          selectedPlan: plan,
          billingInterval 
        }
      });
      return;
    }

    // Navigate to subscription page with selected plan
    navigate('/subscription', { 
      state: { 
        selectedPlan: plan,
        billingInterval 
      }
    });
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
        <p className="mt-4 text-lg text-gray-600">
          Start with a 14-day free trial. No credit card required.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="inline-flex rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setBillingInterval('monthly')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              billingInterval === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('annual')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              billingInterval === 'annual'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Annual (Save 20%)
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isPopular={plan.tier === 'pro'}
            isCurrentPlan={false}
            onSelect={handleSelectPlan}
            billingInterval={billingInterval}
          />
        ))}
      </div>
    </div>
  );
}