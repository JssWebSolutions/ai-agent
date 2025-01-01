import { Widget } from './components/Widget';

// Initialize widget when the script loads
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('ai-agent-widget');
  if (!container || !window.voiceAIConfig) {
    console.error('Widget container not found or configuration missing');
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

  const widget = new Widget();
  container.appendChild(widget);
});