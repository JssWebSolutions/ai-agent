import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { PricingTable } from './PricingTable';
import { UsageStats } from './UsageStats';
import { BillingHistory } from './BillingHistory';
import { Plan, Usage } from '../../types/subscription';
import { PLANS } from '../../services/subscription/plans';
import { getUsageStats } from '../../services/subscription/usage';
import { useToast } from '../../contexts/ToastContext';
import { usePayment } from '../../hooks/usePayment';
import { PaymentModal } from '../Payment/PaymentModal';
import { getPaymentSettings } from '../../services/admin/paymentGateways';
import { PaymentError } from '../../services/payment/errors';

export function SubscriptionPage() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handlePayment } = usePayment();
  const [currentPlan, setCurrentPlan] = useState<Plan>(PLANS.free);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const billingInterval = location.state?.billingInterval || 'monthly';

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [usageData, paymentSettings] = await Promise.all([
          getUsageStats(user.id),
          getPaymentSettings(),
        ]);

        if (!paymentSettings || !Object.values(paymentSettings).some((gateway) => gateway?.enabled)) {
          toast({
            title: 'Payment Not Available',
            description: 'Payment system is not configured. Please contact support.',
            type: 'error',
          });
        }

        if (usageData) {
          setUsage(usageData);
        }
      } catch (error: any) {
        console.error('Error loading subscription data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load subscription data. Please try again.',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate, toast]);

  const handlePlanSelect = async (plan: Plan) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const paymentSettings = await getPaymentSettings();
      if (!paymentSettings || !Object.values(paymentSettings).some((gateway) => gateway?.enabled)) {
        throw new PaymentError('Payment system not configured', 'payment_not_configured');
      }

      setSelectedPlan(plan);
      setIsPaymentModalOpen(true);
    } catch (error: any) {
      if (error instanceof PaymentError) {
        toast({
          title: 'Payment System Error',
          description: error.message,
          type: 'error',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to process plan selection. Please try again.',
          type: 'error',
        });
      }
    }
  };

  const handlePaymentSuccess = async () => {
    if (!selectedPlan) return;

    try {
      await handlePayment(selectedPlan, { card: user?.id });
      setCurrentPlan(selectedPlan);
      toast({
        title: 'Success',
        description: `You've successfully subscribed to the ${selectedPlan.name} plan.`,
        type: 'success',
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Error',
        description: 'Payment failed. Please try again.',
        type: 'error',
      });
    } finally {
      setIsPaymentModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation Menu */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-blue-600">AI Agent</span>
            </div>
            <div className="hidden md:flex space-x-8">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/user')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Login
                </button>
              )}
            </div>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-2 space-y-2">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="block w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="text-center space-y-8 mt-20">
        <h2 className="text-3xl font-bold text-gray-900">Subscription & Usage</h2>
        <p className="text-lg text-gray-600">No credit card required.</p>
        <PricingTable
          onSelectPlan={handlePlanSelect}
          currentPlan={currentPlan}
          billingInterval={billingInterval}
        />
        {usage && <UsageStats usage={usage} plan={currentPlan} />}
        <BillingHistory invoices={[]} />
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess} onSuccess={function (_transactionId: string): void {
            throw new Error('Function not implemented.');
          } }        />
      )}
    </div>
  );
}
