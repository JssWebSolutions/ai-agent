import { useState, useEffect } from 'react';
import { CreditCard, Wallet, Shield } from 'lucide-react';
import { getActivePaymentGateways, PaymentGatewayStatus } from '../../services/payment/paymentService';
import { cn } from '../../utils/cn';

interface PaymentGatewaySelectorProps {
  onSelect: (gateway: string) => void;
  selectedGateway: string | null;
}

export function PaymentGatewaySelector({ onSelect, selectedGateway }: PaymentGatewaySelectorProps) {
  const [gateways, setGateways] = useState<PaymentGatewayStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGateways = async () => {
      try {
        const activeGateways = await getActivePaymentGateways();
        setGateways(activeGateways);
      } catch (error: any) {
        setError(error.message || 'Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    };
    loadGateways();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !gateways) {
    return (
      <div className="text-red-600 p-4 text-center">
        {error || 'No payment methods available'}
      </div>
    );
  }

  const hasActiveGateways = gateways.stripe || gateways.paypal || gateways.razorpay;
  if (!hasActiveGateways) {
    return (
      <div className="text-gray-500 p-4 text-center">
        No payment methods are currently available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gateways.stripe && (
          <button
            onClick={() => onSelect('stripe')}
            className={cn(
              "p-4 border rounded-lg flex flex-col items-center gap-2 transition-all",
              selectedGateway === 'stripe'
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            )}
          >
            <CreditCard className="w-6 h-6 text-blue-600" />
            <span className="font-medium">Credit Card</span>
            <span className="text-xs text-gray-500">Powered by Stripe</span>
          </button>
        )}

        {gateways.paypal && (
          <button
            onClick={() => onSelect('paypal')}
            className={cn(
              "p-4 border rounded-lg flex flex-col items-center gap-2 transition-all",
              selectedGateway === 'paypal'
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            )}
          >
            <Wallet className="w-6 h-6 text-blue-600" />
            <span className="font-medium">PayPal</span>
            <span className="text-xs text-gray-500">Fast & Secure</span>
          </button>
        )}

        {gateways.razorpay && (
          <button
            onClick={() => onSelect('razorpay')}
            className={cn(
              "p-4 border rounded-lg flex flex-col items-center gap-2 transition-all",
              selectedGateway === 'razorpay'
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            )}
          >
            <Shield className="w-6 h-6 text-blue-600" />
            <span className="font-medium">Razorpay</span>
            <span className="text-xs text-gray-500">India's Leading Gateway</span>
          </button>
        )}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
        <Shield className="w-4 h-4" />
        <span>All payments are secure and encrypted</span>
      </div>
    </div>
  );
}