import { WidgetConfig, AgentInfo } from '../types';
import { Agent } from '../../types/agent';

export class WidgetApiClient {
  private readonly agentId: string;
  private readonly apiUrl: string;
  private agent: Agent | null = null;

  constructor(config: WidgetConfig) {
    this.agentId = config.agentId;
    // Ensure apiUrl ends with /api if not provided
    this.apiUrl = config.apiUrl || `${window.location.origin}/api`;
  }

  async initialize() {
    try {
      const agentInfo = await this.getAgentInfo();
      this.agent = agentInfo as Agent;
      return agentInfo;
    } catch (error) {
      console.error('Failed to initialize widget:', error);
      throw error;
    }
  }

  async sendMessage(message: string): Promise<{ response: string }> {
    try {
      if (!this.agent) {
        throw new Error('Widget not properly initialized');
      }

      const response = await fetch(`${this.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Agent-ID': this.agentId
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return { response: data.response };
    } catch (error: any) {
      console.error('Widget API error:', error);
      throw error;
    }
  }

  async getAgentInfo(): Promise<AgentInfo> {
    try {
      // Ensure we're using the correct path format
      const response = await fetch(`${this.apiUrl}/agents/${this.agentId}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Agent-ID': this.agentId
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get agent info');
      }

      return response.json();
    } catch (error) {
      console.error('Widget API error:', error);
      throw error;
    }
  }
}