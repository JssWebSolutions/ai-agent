import { WidgetConfig, AgentInfo } from '../types';
import { getAPIKeys } from '../../services/admin/apiKeys';
import { getChatResponse } from '../../services/api';
import { Agent } from '../../types/agent';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export class WidgetApiClient {
  private readonly agentId: string;
  private agent: Agent | null = null;

  constructor(config: WidgetConfig) {
    this.agentId = config.agentId;
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
      // Verify API keys are available
      const apiKeys = await getAPIKeys();
      if (!apiKeys) {
        throw new Error('API configuration not found. Please contact an administrator.');
      }

      if (!this.agent) {
        throw new Error('Widget not properly initialized');
      }

      // Use the same chat response service as the main app
      const response = await getChatResponse(message, this.agent);
      
      return { response };
    } catch (error: any) {
      console.error('Widget API error:', error);
      throw error;
    }
  }

  async getAgentInfo(): Promise<AgentInfo> {
    try {
      const response = await fetch(`${API_BASE_URL}/agents/${this.agentId}`);
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