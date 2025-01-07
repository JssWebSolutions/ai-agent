import { useState } from 'react';
import { CreditCard, Landmark, Settings } from 'lucide-react';
import { StripeSettings } from './PaymentGateways/StripeSettings';
import { PayPalSettings } from './PaymentGateways/PayPalSettings';
import { RazorpaySettings } from './PaymentGateways/RazorpaySettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';

export function PaymentGatewaysTab() {
  const [activeTab, setActiveTab] = useState('stripe');

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
          <StripeSettings />
        </TabsContent>

        <TabsContent value="paypal">
          <PayPalSettings />
        </TabsContent>

        <TabsContent value="razorpay">
          <RazorpaySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}