import { Plan } from '../../../types/subscription';
import { LoadingSpinner } from '../../LoadingSpinner';

interface RazorpayPaymentFormProps {
  plan: Plan;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  processing: boolean;
}

export function RazorpayPaymentForm({ plan, onSubmit, onCancel, processing }: RazorpayPaymentFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ type: 'razorpay' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Plan Details</h3>
        <div className="space-y-2">
          <p className="text-gray-700">{plan.name} Plan</p>
          <p className="text-2xl font-bold">₹{plan.price.monthly * 80}/month</p>
          <p className="text-sm text-gray-500">Approximately ${plan.price.monthly} USD</p>
        </div>
      </div>

      <div className="p-4 border rounded-lg bg-gray-50 text-center">
        <p className="text-gray-600">
          You will be redirected to Razorpay to complete your payment securely.
        </p>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          disabled={processing}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={processing}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {processing ? (
            <>
              <LoadingSpinner />
              Processing...
            </>
          ) : (
            'Continue to Razorpay'
          )}
        </button>
      </div>
    </form>
  );
}