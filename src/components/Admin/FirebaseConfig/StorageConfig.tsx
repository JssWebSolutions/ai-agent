import{ useState } from 'react';
import { HardDrive, Save } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { updateFirebaseConfig } from '../../../services/admin/firebaseConfig';

export function StorageConfig() {
  const [config, setConfig] = useState({
    maxUploadSize: 5, // MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || ''
  });
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateFirebaseConfig('storage', config);
      toast({
        title: 'Success',
        description: 'Storage configuration updated successfully',
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
          <HardDrive className="w-5 h-5" />
          Storage Configuration
        </h3>
      </div>

      <div className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Storage Bucket</label>
          <input
            type="text"
            value={config.storageBucket}
            onChange={(e) => setConfig({ ...config, storageBucket: e.target.value })}
            className="input-field"
            placeholder="your-app.appspot.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Max Upload Size (MB)</label>
          <input
            type="number"
            value={config.maxUploadSize}
            onChange={(e) => setConfig({ ...config, maxUploadSize: parseInt(e.target.value) })}
            className="input-field"
            min="1"
            max="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Allowed File Types</label>
          <div className="space-y-2">
            {['image/jpeg', 'image/png', 'image/gif'].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.allowedFileTypes.includes(type)}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...config.allowedFileTypes, type]
                      : config.allowedFileTypes.filter(t => t !== type);
                    setConfig({ ...config, allowedFileTypes: newTypes });
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
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
