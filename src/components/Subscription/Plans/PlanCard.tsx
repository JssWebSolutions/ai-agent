import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Plan } from '../../../types/subscription';
import { cn } from '../../../utils/cn';

interface PlanCardProps {
  plan: Plan;
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  onSelect: (plan: Plan) => void;
  billingInterval: 'monthly' | 'annual';
}

export function PlanCard({ 
  plan, 
  isPopular, 
  isCurrentPlan,
  onSelect,
  billingInterval 
}: PlanCardProps) {
  const price = billingInterval === 'monthly' ? plan.price.monthly : plan.price.annual;
  
  const handleSelect = () => {
    if (!isCurrentPlan) {
      onSelect(plan);
    }
  };

  return (
    <div className={cn(
      "relative rounded-2xl border p-8 shadow-sm transition-shadow hover:shadow-md",
      isPopular && "border-blue-600 shadow-blue-100",
      !isPopular && "border-gray-200"
    )}>
      {isPopular && (
        <div className="absolute -top-4 left-0 right-0 mx-auto w-fit">
          <span className="bg-blue-600 text-white px-3 py-1 text-sm font-medium rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
        <p className="mt-2 text-sm text-gray-500">{plan.features[0]}</p>
        <p className="mt-4">
          <span className="text-4xl font-bold text-gray-900">${price}</span>
          <span className="text-sm text-gray-500">/{billingInterval}</span>
        </p>
      </div>

      <ul className="mt-8 space-y-3">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSelect}
        disabled={isCurrentPlan}
        className={cn(
          "mt-8 w-full rounded-lg px-4 py-2 text-center font-medium",
          isCurrentPlan 
            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
            : isPopular
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-900 text-white hover:bg-gray-800",
          "flex items-center justify-center gap-2 transition-colors"
        )}
      >
        {isCurrentPlan ? (
          'Current Plan'
        ) : (
          <>
            {plan.tier === 'free' ? 'Start Free Trial' : 'Select Plan'}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}