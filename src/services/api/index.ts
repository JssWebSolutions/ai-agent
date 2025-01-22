import { getAPIKeys } from '../admin/apiKeys';
import { getOpenAIResponse } from './openai';
import { getGeminiResponse } from './gemini';
import { Agent } from '../../types/agent';

export async function getChatResponse(message: string, agent: Agent): Promise<string> {
  try {
    const apiKeys = await getAPIKeys();
    if (!apiKeys) {
      throw new Error('API configuration not found. Please contact an administrator.');
    }

    if (agent.llmProvider === 'openai') {
      if (!apiKeys.openai) {
        throw new Error('OpenAI API key not configured. Please contact an administrator.');
      }
      return getOpenAIResponse(message, agent, apiKeys.openai);
    } else {
      if (!apiKeys.gemini) {
        throw new Error('Gemini API key not configured. Please contact an administrator.');
      }
      return getGeminiResponse(message, agent, apiKeys.gemini);
    }
  } catch (error: any) {
    console.error('API error:', error);
    // Ensure we always throw an Error object with a message
    throw new Error(error.message || 'Failed to get response from AI service');
  }
}