export type PlanTier = 'free' | 'starter' | 'pro' | 'enterprise';

export interface Plan {
  id: string;
  name: string;
  tier: PlanTier;
  price: {
    monthly: number;
    annual: number;
  };
  features: string[];
  limits: {
    messagesPerMonth: number;
    agentsPerAccount: number;
    customization: boolean;
    analytics: boolean;
    support: 'community' | 'email' | 'priority' | '24/7';
  };
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  paymentMethod?: {
    type: 'card' | 'paypal';
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
}

export interface Usage {
  userId: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    totalMessages: number;
    totalAgents: number;
    storageUsed: number;
  };
  notifications: Array<{
    type: 'warning' | 'critical';
    threshold: number;
    sentAt: Date;
  }>;
}

export interface Invoice {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  createdAt: Date;
  paidAt?: Date;
  periodStart: Date;
  periodEnd: Date;
  items: Array<{
    description: string;
    amount: number;
    quantity: number;
  }>;
  pdf?: string;
}