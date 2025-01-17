import { WidgetConfig } from '../types';
import { WidgetApiClient } from '../api/client';
import './ChatBubble';
import './ChatInput';

export class Widget extends HTMLElement {
  private config: WidgetConfig;
  private client: WidgetApiClient;
  private isOpen = false;
  private recognition: any = null;

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
      const agentInfo = await this.client.getAgentInfo();
      this.config = { ...this.config, ...agentInfo };
    } catch (error) {
      console.error('Failed to initialize widget:', error);
    }
  }

  private render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            --primary-color: ${this.config.theme === 'custom' ? this.config.customColors?.primary : '#3B82F6'};
            --text-color: ${this.config.theme === 'custom' ? this.config.customColors?.text : '#1F2937'};
            --bg-color: ${this.config.theme === 'custom' ? this.config.customColors?.background : '#FFFFFF'};
            
            position: fixed;
            ${this.config.position}: 20px;
            z-index: 9999;
          }
          .widget-container {
            width: 360px;
            max-height: 600px;
            background: var(--bg-color);
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            display: ${this.isOpen ? 'flex' : 'none'};
            flex-direction: column;
          }
          .widget-header {
            padding: 16px;
            background: var(--primary-color);
            color: white;
            border-radius: 12px 12px 0 0;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .widget-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            min-height: 300px;
            max-height: 400px;
          }
          .toggle-button {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: var(--primary-color);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s;
          }
          .toggle-button:hover {
            transform: scale(1.1);
          }
        </style>
        
        <div class="widget-container">
          <div class="widget-header">
            <img src="${this.config.image}" alt="${this.config.name}" width="32" height="32" style="border-radius: 50%;" />
            <span>${this.config.name}</span>
          </div>
          <div class="widget-messages" id="messages"></div>
          <chat-input></chat-input>
        </div>
        
        <button class="toggle-button" id="toggle">💬</button>
      `;
    }
  }

  private setupListeners() {
    const toggleButton = this.shadowRoot?.querySelector('#toggle');
    const chatInput = this.shadowRoot?.querySelector('chat-input');

    toggleButton?.addEventListener('click', () => {
      this.isOpen = !this.isOpen;
      this.render();
    });

    chatInput?.addEventListener('message', async (e: any) => {
      await this.handleMessage(e.detail.text);
    });

    chatInput?.addEventListener('startSpeech', () => this.startSpeechRecognition());
    chatInput?.addEventListener('stopSpeech', () => this.stopSpeechRecognition());
  }

  private async handleMessage(text: string) {
    this.addMessage(text, 'user');
    try {
      const { response } = await this.client.sendMessage(text);
      this.addMessage(response, 'bot');
    } catch (error) {
      this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
    }
  }

  private addMessage(text: string, sender: 'user' | 'bot') {
    const messagesContainer = this.shadowRoot?.querySelector('#messages');
    if (messagesContainer) {
      const bubble = document.createElement('chat-bubble');
      bubble.setAttribute('message', text);
      bubble.setAttribute('sender', sender);
      bubble.setAttribute('timestamp', new Date().toISOString());
      messagesContainer.appendChild(bubble);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  private startSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        this.handleMessage(text);
      };

      this.recognition.start();
    }
  }

  private stopSpeechRecognition() {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
  }
}

customElements.define('voice-ai-widget', Widget);
