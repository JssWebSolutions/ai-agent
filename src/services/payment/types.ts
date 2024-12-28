export interface PaymentMethod {
  type: 'card' | 'paypal';
  card?: {
    number: string;
    expMonth: number;
    expYear: number;
    cvc: string;
  };
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  paymentMethod: PaymentMethod;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}