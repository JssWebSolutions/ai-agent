import { useState, useEffect } from 'react';
import { CreditCard, Landmark, Settings } from 'lucide-react';
import { StripeSettings } from './PaymentGateways/StripeSettings';
import { PayPalSettings } from './PaymentGateways/PayPalSettings';
import { RazorpaySettings } from './PaymentGateways/RazorpaySettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { getPaymentSettings } from '../../services/admin/paymentGateways';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export function PaymentGatewaysTab() {
  const [activeTab, setActiveTab] = useState('stripe');
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const paymentSettings = await getPaymentSettings();
        setSettings(paymentSettings || {});
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load payment settings',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Payment Gateway Settings
        </h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex gap-2 p-1 mb-6">
          <TabsTrigger value="stripe" className="tab-trigger">
            <CreditCard className="w-4 h-4" />
            Stripe
          </TabsTrigger>
          <TabsTrigger value="paypal" className="tab-trigger">
            <Landmark className="w-4 h-4" />
            PayPal
          </TabsTrigger>
          <TabsTrigger value="razorpay" className="tab-trigger">
            <CreditCard className="w-4 h-4" />
            Razorpay
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stripe">
          <StripeSettings 
            initialSettings={settings?.stripe}
            userId={user?.id || ''}
          />
        </TabsContent>

        <TabsContent value="paypal">
          <PayPalSettings 
            initialSettings={settings?.paypal}
            userId={user?.id || ''}
          />
        </TabsContent>

        <TabsContent value="razorpay">
          <RazorpaySettings 
            initialSettings={settings?.razorpay}
            userId={user?.id || ''}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}