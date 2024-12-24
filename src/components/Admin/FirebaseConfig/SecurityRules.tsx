import React, { useState } from 'react';
import { Shield, Save } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { updateFirebaseConfig } from '../../../services/admin/firebaseConfig';

export function SecurityRules() {
  const [rules, setRules] = useState({
    firestore: '',
    storage: ''
  });
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateFirebaseConfig('rules', rules);
      toast({
        title: 'Success',
        description: 'Security rules updated successfully',
        type: 'success'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update security rules',
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
          <Shield className="w-5 h-5" />
          Security Rules
        </h3>
      </div>

      <div className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Firestore Rules</label>
          <textarea
            value={rules.firestore}
            onChange={(e) => setRules({ ...rules, firestore: e.target.value })}
            className="input-field font-mono"
            rows={10}
            placeholder="rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Your rules here
  }
}"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Storage Rules</label>
          <textarea
            value={rules.storage}
            onChange={(e) => setRules({ ...rules, storage: e.target.value })}
            className="input-field font-mono"
            rows={10}
            placeholder="rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Your rules here
  }
}"
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
          Save Security Rules
        </button>
      </div>
    </div>
  );
}
