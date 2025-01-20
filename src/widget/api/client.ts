import { WidgetConfig, AgentInfo } from '../types';
import { getAPIKeys } from '../../services/admin/apiKeys';
import { getChatResponse } from '../../services/api';
import { Agent } from '../../types/agent';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export class WidgetApiClient {
  private readonly agentId: string;
  private agent: Agent | null = null;
  private apiKeys: { openai?: string; gemini?: string } | null = null;

  constructor(config: WidgetConfig) {
    this.agentId = config.agentId;
  }

  async initialize() {
    try {
      // Get agent info and API keys in parallel
      const [agentInfo, apiKeys] = await Promise.all([
        this.getAgentInfo(),
        getAPIKeys()
      ]);

      this.agent = agentInfo as Agent;
      this.apiKeys = apiKeys;

      if (!this.apiKeys) {
        throw new Error('API configuration not found. Please contact an administrator.');
      }

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

      if (!this.apiKeys) {
        throw new Error('API configuration not found. Please contact an administrator.');
      }

      // Check if the required API key is available based on the agent's provider
      const requiredKey = this.agent.llmProvider === 'openai' ? this.apiKeys.openai : this.apiKeys.gemini;
      if (!requiredKey) {
        throw new Error(`${this.agent.llmProvider === 'openai' ? 'OpenAI' : 'Gemini'} API key not configured. Please contact an administrator.`);
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