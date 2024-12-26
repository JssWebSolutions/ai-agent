import React, { useState } from 'react';
import { PlanCard } from './PlanCard';
import { Plan } from '../../../types/subscription';
import { PLANS } from '../../../services/subscription/plans';

interface PlanSelectorProps {
  currentPlan?: Plan;
  onSelectPlan: (plan: Plan) => void;
}

export function PlanSelector({ currentPlan, onSelectPlan }: PlanSelectorProps) {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual'>('monthly');
  const plans = Object.values(PLANS);

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
            isCurrentPlan={currentPlan?.id === plan.id}
            onSelect={onSelectPlan}
            billingInterval={billingInterval}
          />
        ))}
      </div>
    </div>
  );
}
