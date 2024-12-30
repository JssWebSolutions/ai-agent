import{ useState } from 'react';
import { Database, Save } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { updateFirebaseConfig } from '../../../services/admin/firebaseConfig';

export function FirestoreConfig() {
  const [config, setConfig] = useState({
    enablePersistence: true,
    cacheSizeBytes: 5242880, // 5MB
    experimentalAutoDetectLongPolling: true
  });
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateFirebaseConfig('firestore', config);
      toast({
        title: 'Success',
        description: 'Firestore configuration updated successfully',
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
          <Database className="w-5 h-5" />
          Firestore Configuration
        </h3>
      </div>

      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Enable Persistence</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={config.enablePersistence}
              onChange={(e) => setConfig({ ...config, enablePersistence: e.target.checked })}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cache Size (bytes)</label>
          <input
            type="number"
            value={config.cacheSizeBytes}
            onChange={(e) => setConfig({ ...config, cacheSizeBytes: parseInt(e.target.value) })}
            className="input-field"
            min="1048576"
            step="1048576"
          />
          <p className="mt-1 text-sm text-gray-500">Minimum: 1MB (1048576 bytes)</p>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Auto-detect Long Polling</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={config.experimentalAutoDetectLongPolling}
              onChange={(e) => setConfig({ ...config, experimentalAutoDetectLongPolling: e.target.checked })}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
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
