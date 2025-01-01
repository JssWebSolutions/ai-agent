
import { Check } from 'lucide-react';
import { Plan } from '../../types/subscription';
import { PLANS } from '../../services/subscription/plans';
import { useAuth } from '../../contexts/AuthContext';

interface PricingTableProps {
  onSelectPlan: (plan: Plan) => void; 
  currentPlan?: Plan;
  billingInterval?: 'monthly' | 'annual';
}

export function PricingTable({
  onSelectPlan,
  currentPlan,
  billingInterval = 'monthly'
}: PricingTableProps) {
  useAuth();
  const plans = Object.values(PLANS);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const price = billingInterval === 'monthly' 
            ? plan.price.monthly 
            : plan.price.annual;
          const isCurrentPlan = currentPlan?.id === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative rounded-lg shadow-lg bg-white p-6 ${
                plan.tier === 'pro' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.tier === 'pro' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white text-sm font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-4 text-sm text-gray-500">
                  {plan.features[0]}
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-bold text-gray-900">
                    ${price}
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    /{billingInterval}
                  </span>
                </p>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700">{feature}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <button
                  onClick={() => onSelectPlan(plan)}
                  disabled={isCurrentPlan}
                  className={`w-full rounded-lg px-4 py-2 text-center font-medium ${
                    isCurrentPlan
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : plan.tier === 'pro'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  }`}
                >
                  {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}