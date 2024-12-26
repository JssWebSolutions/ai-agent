import { Plan, PlanTier } from '../../types/subscription';

export const PLANS: Record<PlanTier, Plan> = {
  free: {
    id: 'plan_free',
    name: 'Free',
    tier: 'free',
    price: {
      monthly: 0,
      annual: 0
    },
    features: [
      '1 AI Agent',
      '100 messages/month',
      'Basic customization',
      'Community support'
    ],
    limits: {
      messagesPerMonth: 100,
      agentsPerAccount: 1,
      customization: false,
      analytics: false,
      support: 'community'
    }
  },
  starter: {
    id: 'plan_starter',
    name: 'Starter',
    tier: 'starter',
    price: {
      monthly: 29,
      annual: 290
    },
    features: [
      '3 AI Agents',
      '1,000 messages/month',
      'Basic customization',
      'Email support',
      'Basic analytics'
    ],
    limits: {
      messagesPerMonth: 1000,
      agentsPerAccount: 3,
      customization: true,
      analytics: true,
      support: 'email'
    }
  },
  pro: {
    id: 'plan_pro',
    name: 'Professional',
    tier: 'pro',
    price: {
      monthly: 79,
      annual: 790
    },
    features: [
      'Unlimited AI Agents',
      '5,000 messages/month',
      'Advanced customization',
      'Priority support',
      'Advanced analytics',
      'Custom branding'
    ],
    limits: {
      messagesPerMonth: 5000,
      agentsPerAccount: Infinity,
      customization: true,
      analytics: true,
      support: 'priority'
    }
  },
  enterprise: {
    id: 'plan_enterprise',
    name: 'Enterprise',
    tier: 'enterprise',
    price: {
      monthly: 299,
      annual: 2990
    },
    features: [
      'Unlimited AI Agents',
      'Unlimited messages',
      'Full customization',
      '24/7 dedicated support',
      'Custom integrations',
      'SLA guarantee'
    ],
    limits: {
      messagesPerMonth: Infinity,
      agentsPerAccount: Infinity,
      customization: true,
      analytics: true,
      support: '24/7'
    }
  }
};

export function getPlanByTier(tier: PlanTier): Plan {
  return PLANS[tier];
}

export function calculateProration(
  currentPlan: Plan,
  newPlan: Plan,
  daysRemaining: number,
  daysInBillingPeriod: number
): number {
  const currentAmount = currentPlan.price.monthly;
  const newAmount = newPlan.price.monthly;
  const dailyRate = (newAmount - currentAmount) / daysInBillingPeriod;
  return Math.max(0, dailyRate * daysRemaining);
}