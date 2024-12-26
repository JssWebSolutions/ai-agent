import { WidgetConfig, AgentInfo } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://default.api.url';

export class WidgetApiClient {
  private readonly agentId: string;
  private readonly config: WidgetConfig;

  constructor(config: WidgetConfig) {
    this.agentId = config.agentId;
    this.config = config;
  }

  async sendMessage(message: string): Promise<{ response: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/agents/${this.agentId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, config: this.config })
      });

      if (!response.ok) throw new Error('Failed to get response');
      return response.json();
    } catch (error) {
      console.error('Widget API error:', error);
      throw error;
    }
  }

  async getAgentInfo(): Promise<AgentInfo> {
    try {
      const response = await fetch(`${API_BASE_URL}/agents/${this.agentId}`);
      if (!response.ok) throw new Error('Failed to get agent info');
      return response.json();
    } catch (error) {
      console.error('Widget API error:', error);
      throw error;
    }
  }
}
