export class ChatInput extends HTMLElement {
  private input: HTMLInputElement | null = null;
  private sendButton: HTMLButtonElement | null = null;
  private micButton: HTMLButtonElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  private render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            padding: 12px;
            border-top: 1px solid var(--border-color, #E5E7EB);
          }
          .input-container {
            display: flex;
            gap: 8px;
            align-items: center;
          }
          input {
            flex: 1;
            padding: 8px 16px;
            border-radius: 20px;
            border: 1px solid var(--border-color, #E5E7EB);
            outline: none;
            font-size: 14px;
          }
          button {
            padding: 8px;
            border-radius: 50%;
            border: none;
            background: none;
            cursor: pointer;
            color: var(--icon-color, #6B7280);
            transition: color 0.2s;
          }
          button:hover {
            color: var(--primary-color, #3B82F6);
          }
          .mic-active {
            color: var(--error-color, #EF4444);
          }
        </style>
        <div class="input-container">
          <button id="mic">🎤</button>
          <input type="text" placeholder="Type your message..." />
          <button id="send">➤</button>
        </div>
      `;

      this.input = this.shadowRoot.querySelector('input');
      this.sendButton = this.shadowRoot.querySelector('#send');
      this.micButton = this.shadowRoot.querySelector('#mic');
    }
  }

  private setupListeners() {
    this.input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.dispatchMessage();
    });

    this.sendButton?.addEventListener('click', () => this.dispatchMessage());
    this.micButton?.addEventListener('click', () => this.toggleSpeechRecognition());
  }

  private dispatchMessage() {
    if (this.input?.value.trim()) {
      this.dispatchEvent(new CustomEvent('message', {
        detail: { text: this.input.value.trim() }
      }));
      this.input.value = '';
    }
  }

  private toggleSpeechRecognition() {
    const event = this.micButton?.classList.contains('mic-active') ? 'stopSpeech' : 'startSpeech';
    this.micButton?.classList.toggle('mic-active');
    this.dispatchEvent(new CustomEvent(event));
  }
}

customElements.define('chat-input', ChatInput);
