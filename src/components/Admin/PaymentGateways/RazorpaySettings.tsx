import { useState } from 'react';
import { Eye, EyeOff, Save } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { updateRazorpaySettings } from '../../../services/admin/paymentGateways';

export function RazorpaySettings() {
  const [settings, setSettings] = useState({
    keyId: '',
    keySecret: '',
    webhookSecret: '',
    enabled: false
  });
  const [showSecrets, setShowSecrets] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateRazorpaySettings(settings);
      toast({
        title: 'Success',
        description: 'Razorpay settings updated successfully',
        type: 'success'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update Razorpay settings',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Key ID
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type={showSecrets ? "text" : "password"}
              value={settings.keyId}
              onChange={(e) => setSettings({ ...settings, keyId: e.target.value })}
              className="block w-full pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="rzp_..."
            />
            <button
              type="button"
              onClick={() => setShowSecrets(!showSecrets)}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {showSecrets ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Key Secret
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type={showSecrets ? "text" : "password"}
              value={settings.keySecret}
              onChange={(e) => setSettings({ ...settings, keySecret: e.target.value })}
              className="block w-full pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Webhook Secret
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type={showSecrets ? "text" : "password"}
              value={settings.webhookSecret}
              onChange={(e) => setSettings({ ...settings, webhookSecret: e.target.value })}
              className="block w-full pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Enable Razorpay</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={settings.enabled}
              onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Settings
        </button>
      </div>
    </div>
  );
}