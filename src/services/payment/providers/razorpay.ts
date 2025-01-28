import { Plan } from '../../../types/subscription';
import { PaymentError } from '../errors';

export async function processRazorpayPayment(
  plan: Plan,
  paymentData: any,
  settings: { keyId: string; keySecret: string; webhookSecret: string }
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  try {
    if (!settings.keyId) {
      throw new PaymentError('Razorpay configuration missing', 'razorpay_config_missing');
    }

    // Initialize Razorpay
    const Razorpay = (window as any).Razorpay;
    if (!Razorpay) {
      throw new PaymentError('Razorpay SDK not loaded', 'razorpay_sdk_missing');
    }

    // Create Razorpay order
    const options = {
      key: settings.keyId,
      amount: plan.price.monthly * 100, // Convert to smallest currency unit (paise)
      currency: 'INR',
      name: 'AI Agent Manager',
      description: `${plan.name} Plan Subscription`,
      order_id: paymentData.orderId,
      handler: function(response: any) {
        if (response.razorpay_payment_id) {
          return {
            success: true,
            transactionId: response.razorpay_payment_id
          };
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();

    return new Promise((resolve) => {
      rzp.on('payment.success', (response: any) => {
        resolve({
          success: true,
          transactionId: response.razorpay_payment_id
        });
      });

      rzp.on('payment.error', (error: any) => {
        resolve({
          success: false,
          error: error.description || 'Payment failed'
        });
      });
    });
  } catch (error: any) {
    console.error('Razorpay payment error:', error);
    return {
      success: false,
      error: error.message || 'Razorpay payment processing failed'
    };
  }
}