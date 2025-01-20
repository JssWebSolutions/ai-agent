import { WidgetConfig } from '../types';
import { WidgetApiClient } from '../api/client';
import './ChatBubble';
import './ChatInput';

export class Widget extends HTMLElement {
  private config: WidgetConfig;
  private client: WidgetApiClient;
  private isOpen = false;
  private recognition: any = null;
  private isProcessing = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.config = (window as any).voiceAIConfig || {};
    this.client = new WidgetApiClient(this.config);
  }

  async connectedCallback() {
    await this.initializeWidget();
    this.render();
    this.setupListeners();
  }

  private async initializeWidget() {
    try {
      const agentInfo = await this.client.initialize();
      this.config = { ...this.config, ...agentInfo };
    } catch (error) {
      console.error('Failed to initialize widget:', error);
      this.showError('Failed to initialize chat widget. Please try again later.');
    }
  }

  private showError(message: string) {
    const messagesContainer = this.shadowRoot?.querySelector('#messages');
    if (messagesContainer) {
      const errorBubble = document.createElement('chat-bubble');
      errorBubble.setAttribute('message', message);
      errorBubble.setAttribute('sender', 'agent');
      errorBubble.setAttribute('timestamp', new Date().toISOString());
      errorBubble.setAttribute('error', 'true');
      messagesContainer.appendChild(errorBubble);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  private async handleMessage(text: string) {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    this.addMessage(text, 'user');

    try {
      const { response } = await this.client.sendMessage(text);
      this.addMessage(response, 'agent');
    } catch (error: any) {
      this.showError(error.message || 'Sorry, I encountered an error. Please try again.');
    } finally {
      this.isProcessing = false;
    }
  }

  // ... rest of the Widget class implementation remains the same ...
}

customElements.define('voice-ai-widget', Widget);