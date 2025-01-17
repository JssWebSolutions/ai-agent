import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { getAPIKeys, updateAPIKeys } from '../../services/admin/apiKeys';

export function APIKeysSection() {
  const [keys, setKeys] = useState({
    openai: '',
    gemini: ''
  });
  const [showKeys, setShowKeys] = useState({
    openai: false,
    gemini: false
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadAPIKeys();
  }, []);

  const loadAPIKeys = async () => {
    try {
      const apiKeys = await getAPIKeys();
      if (apiKeys) {
        setKeys({
          openai: apiKeys.openai || '',
          gemini: apiKeys.gemini || ''
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load API keys',
        type: 'error'
      });
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      await updateAPIKeys(keys, user.id);
      toast({
        title: 'Success',
        description: 'API keys updated successfully',
        type: 'success'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update API keys',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-6">
        <Key className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold">API Keys Configuration</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">OpenAI API Key</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type={showKeys.openai ? "text" : "password"}
              value={keys.openai}
              onChange={(e) => setKeys(prev => ({ ...prev, openai: e.target.value }))}
              className="block w-full pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="sk-..."
            />
            <button
              type="button"
              onClick={() => setShowKeys(prev => ({ ...prev, openai: !prev.openai }))}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {showKeys.openai ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Google Gemini API Key</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type={showKeys.gemini ? "text" : "password"}
              value={keys.gemini}
              onChange={(e) => setKeys(prev => ({ ...prev, gemini: e.target.value }))}
              className="block w-full pr-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your Gemini API key"
            />
            <button
              type="button"
              onClick={() => setShowKeys(prev => ({ ...prev, gemini: !prev.gemini }))}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {showKeys.gemini ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
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
          Save API Keys
        </button>
      </div>
    </div>
  );
}