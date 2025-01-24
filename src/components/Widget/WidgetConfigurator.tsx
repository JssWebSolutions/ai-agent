import { useState, useEffect } from 'react';
import { Code, Copy, Check } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { AppearanceSettings } from './AppearanceSettings';
import { WidgetPreview } from './WidgetPreview';
import { useWidgetSettings } from '../../hooks/useWidgetSettings';
import { FloatingSaveButton } from '../SaveButton/FloatingSaveButton';
import { getAPIKeys } from '../../services/admin/apiKeys';
import { useToast } from '../../contexts/ToastContext';

export function WidgetConfigurator() {
  const [copied, setCopied] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { selectedAgent, updateAgent } = useAgentStore();
  const { isSaving, saveSettings } = useWidgetSettings(selectedAgent?.id || '');
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<any>(null);

  useEffect(() => {
    const loadApiKeys = async () => {
      try {
        const keys = await getAPIKeys();
        setApiKeys(keys);
      } catch (error) {
        console.error('Failed to load API keys:', error);
      }
    };
    loadApiKeys();
  }, []);

  if (!selectedAgent) return null;

  const handlePreviewClick = async () => {
    try {
      if (!apiKeys) {
        toast({
          title: 'Error',
          description: 'API keys not configured. Please configure API keys in the admin settings.',
          type: 'error'
        });
        return;
      }

      const requiredKey = selectedAgent.llmProvider === 'openai' ? apiKeys.openai : apiKeys.gemini;
      if (!requiredKey) {
        toast({
          title: 'API Key Required',
          description: `${selectedAgent.llmProvider === 'openai' ? 'OpenAI' : 'Gemini'} API key not configured. Please configure in admin settings.`,
          type: 'error'
        });
        return;
      }

      setIsPreviewOpen(true);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to initialize widget preview',
        type: 'error'
      });
    }
  };

  const widgetUrl = import.meta.env.VITE_WIDGET_URL || window.location.origin;
  const widgetCode = `<!-- AI Agent Widget -->
<div id="ai-agent-widget"></div>
<script>
  (function() {
    window.voiceAIConfig = {
      agentId: "${selectedAgent.id}",
      theme: "${selectedAgent.widgetSettings.theme}",
      position: "${selectedAgent.widgetSettings.position}",
      buttonSize: "${selectedAgent.widgetSettings.buttonSize}",
      borderRadius: "${selectedAgent.widgetSettings.borderRadius}",
      showAgentImage: ${selectedAgent.widgetSettings.showAgentImage},
      ${selectedAgent.widgetSettings.theme === 'custom' ? `
      customColors: ${JSON.stringify(selectedAgent.widgetSettings.customColors, null, 2)},` : ''}
      apiUrl: "${widgetUrl}/api"
    };

    var script = document.createElement('script');
    script.src = "${widgetUrl}/widget.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);
  })();
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(widgetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSettingsChange = async (newSettings: typeof selectedAgent.widgetSettings) => {
    const updatedAgent = {
      ...selectedAgent,
      widgetSettings: newSettings
    };
    await updateAgent(updatedAgent);
    await saveSettings(newSettings);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        <AppearanceSettings
          agent={selectedAgent}
          onChange={handleSettingsChange}
          disabled={isSaving}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Code className="w-5 h-5" />
            Embed Code
          </h3>

          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">HTML</span>
              <button
                onClick={handleCopy}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            <pre className="text-gray-100 text-sm overflow-x-auto whitespace-pre-wrap">
              {widgetCode}
            </pre>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Integration Instructions</h4>
            <ol className="list-decimal list-inside text-sm text-blue-700 space-y-2">
              <li>Copy the embed code above</li>
              <li>Paste it just before the closing <code>&lt;/body&gt;</code> tag of your website</li>
              <li>The widget will automatically initialize and display on your site</li>
              <li>Make sure your domain is allowed in the CORS settings</li>
            </ol>
          </div>

          <button
            onClick={handlePreviewClick}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Preview Widget
          </button>
        </div>
      </div>

      <WidgetPreview
        agent={selectedAgent}
        isOpen={isPreviewOpen}
        onToggle={() => setIsPreviewOpen(!isPreviewOpen)}
      />

      {isSaving && (
        <FloatingSaveButton
          onSave={async () => {}}
          hasChanges={false}
          isLoading={true}
        />
      )}
    </div>
  );
}