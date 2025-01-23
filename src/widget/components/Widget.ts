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
  setupListeners: any;

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

  private render() {
    if (!this.shadowRoot) return;

    const colors = this.getThemeColors();
    const position = this.getPositionStyles();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --primary-color: ${colors.primary};
          --background-color: ${colors.background};
          --text-color: ${colors.text};
          --border-color: #E5E7EB;
          --timestamp-color: #6B7280;
          --icon-color: #6B7280;
          --error-color: #EF4444;
          
          position: fixed;
          ${position}
          z-index: 9999;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .widget-container {
          width: 360px;
          max-height: 600px;
          background: var(--background-color);
          border-radius: ${this.getBorderRadius()};
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: ${this.isOpen ? 'flex' : 'none'};
          flex-direction: column;
          overflow: hidden;
        }

        .widget-header {
          background: var(--primary-color);
          color: white;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .agent-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .agent-image {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .toggle-button {
          width: ${this.getButtonSize()};
          height: ${this.getButtonSize()};
          border-radius: ${this.getBorderRadius()};
          background: var(--primary-color);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          transition: transform 0.2s;
          display: ${this.isOpen ? 'none' : 'flex'};
        }

        .toggle-button:hover {
          transform: scale(1.05);
        }

        .close-button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      </style>

      <button class="toggle-button" aria-label="Open chat">
        ${this.config.showAgentImage && this.config.image 
          ? `<img src="${this.config.image}" alt="${this.config.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">` 
          : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>'}
      </button>

      <div class="widget-container">
        <div class="widget-header">
          <div class="agent-info">
            ${this.config.showAgentImage ? `
              <div class="agent-image">
                ${this.config.image 
                  ? `<img src="${this.config.image}" alt="${this.config.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` 
                  : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>'}
              </div>
            ` : ''}
            <span>${this.config.name || 'AI Assistant'}</span>
          </div>
          <button class="close-button" aria-label="Close chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="messages" id="messages"></div>
        <chat-input></chat-input>
      </div>
    `;

    this.setupEventListeners();
  }

  private setupEventListeners() {
    const toggleButton = this.shadowRoot?.querySelector('.toggle-button');
    const closeButton = this.shadowRoot?.querySelector('.close-button');
    const chatInput = this.shadowRoot?.querySelector('chat-input');

    toggleButton?.addEventListener('click', () => this.toggleWidget());
    closeButton?.addEventListener('click', () => this.toggleWidget());
    chatInput?.addEventListener('message', (e: any) => this.handleMessage(e.detail.text));
    chatInput?.addEventListener('startSpeech', () => this.startSpeechRecognition());
    chatInput?.addEventListener('stopSpeech', () => this.stopSpeechRecognition());
  }

  private toggleWidget() {
    this.isOpen = !this.isOpen;
    this.render();
  }

  private getThemeColors() {
    if (this.config.theme === 'custom' && this.config.customColors) {
      return this.config.customColors;
    }
    return this.config.theme === 'dark'
      ? { primary: '#3B82F6', background: '#1F2937', text: '#F9FAFB' }
      : { primary: '#3B82F6', background: '#FFFFFF', text: '#111827' };
  }

  private getPositionStyles() {
    const positions = {
      'bottom-right': 'bottom: 20px; right: 20px;',
      'bottom-left': 'bottom: 20px; left: 20px;',
      'top-right': 'top: 20px; right: 20px;',
      'top-left': 'top: 20px; left: 20px;'
    };
    return positions[this.config.position || 'bottom-right'];
  }

  private getButtonSize() {
    const sizes = {
      small: '48px',
      medium: '56px',
      large: '64px'
    };
    return sizes[this.config.buttonSize || 'medium'];
  }

  private getBorderRadius() {
    const radii = {
      none: '0',
      small: '8px',
      medium: '12px',
      large: '16px'
    };
    return radii[this.config.borderRadius || 'medium'];
  }

  private addMessage(text: string, sender: 'user' | 'agent') {
    const messagesContainer = this.shadowRoot?.querySelector('#messages');
    if (!messagesContainer) return;

    const bubble = document.createElement('chat-bubble');
    bubble.setAttribute('message', text);
    bubble.setAttribute('sender', sender);
    bubble.setAttribute('timestamp', new Date().toISOString());
    messagesContainer.appendChild(bubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  private showError(message: string) {
    const messagesContainer = this.shadowRoot?.querySelector('#messages');
    if (!messagesContainer) return;

    const errorBubble = document.createElement('chat-bubble');
    errorBubble.setAttribute('message', message);
    errorBubble.setAttribute('sender', 'agent');
    errorBubble.setAttribute('timestamp', new Date().toISOString());
    errorBubble.setAttribute('error', 'true');
    messagesContainer.appendChild(errorBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
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

  private startSpeechRecognition() {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      this.showError('Speech recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;

    this.recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');

      if (event.results[0].isFinal) {
        this.handleMessage(transcript);
      }
    };

    this.recognition.start();
  }

  private stopSpeechRecognition() {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
  }
}

customElements.define('voice-ai-widget', Widget);