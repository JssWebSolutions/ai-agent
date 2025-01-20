import { Widget } from './components/Widget';
import { WidgetConfig } from './types';

// Initialize widget when the script loads
window.addEventListener('load', () => {
  const container = document.getElementById('ai-agent-widget');
  if (!container) {
    console.error('Widget container element not found. Make sure to add <div id="ai-agent-widget"></div> to your page.');
    return;
  }

  if (!window.voiceAIConfig) {
    console.error('Widget configuration missing. Make sure to define window.voiceAIConfig before loading the widget.');
    return;
  }

  // Parse customColors if it's a string
  if (typeof window.voiceAIConfig.customColors === 'string') {
    try {
      window.voiceAIConfig.customColors = JSON.parse(window.voiceAIConfig.customColors);
    } catch (e) {
      console.error('Failed to parse customColors:', e);
      window.voiceAIConfig.customColors = null;
    }
  }

  // Validate required configuration
  const config = window.voiceAIConfig as WidgetConfig;
  if (!config.agentId) {
    console.error('Agent ID is required in widget configuration');
    return;
  }

  const widget = new Widget();
  container.appendChild(widget);
});