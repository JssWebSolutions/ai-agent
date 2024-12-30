import{ useState } from 'react';
import { Key, Eye, EyeOff, Save } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { updateFirebaseConfig } from '../../../services/admin/firebaseConfig';

export function FirebaseAuthConfig() {
  const [showKeys, setShowKeys] = useState(false);
  const [config, setConfig] = useState({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || ''
  });
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateFirebaseConfig('auth', config);
      toast({
        title: 'Success',
        description: 'Firebase authentication configuration updated successfully',
        type: 'success'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update configuration',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title flex items-center gap-2">
          <Key className="w-5 h-5" />
          Authentication Configuration
        </h3>
      </div>

      <div className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">API Key</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type={showKeys ? 'text' : 'password'}
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              className="input-field pr-10"
              placeholder="Enter Firebase API Key"
            />
            <button
              type="button"
              onClick={() => setShowKeys(!showKeys)}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {showKeys ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Auth Domain</label>
          <input
            type="text"
            value={config.authDomain}
            onChange={(e) => setConfig({ ...config, authDomain: e.target.value })}
            className="input-field"
            placeholder="your-app.firebaseapp.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Project ID</label>
          <input
            type="text"
            value={config.projectId}
            onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
            className="input-field"
            placeholder="your-project-id"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Configuration
        </button>
      </div>
    </div>
  );
}
