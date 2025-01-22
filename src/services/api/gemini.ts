import { GoogleGenerativeAI } from '@google/generative-ai';
import { Agent } from '../../types/agent';
import { formatTrainingExamples, getDefaultTrainingExamples } from '../trainingData';

export async function getGeminiResponse(message: string, agent: Agent, apiKey: string) {
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please contact an administrator.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: agent.model });

    const trainingExamples = getDefaultTrainingExamples(agent);
    const systemPrompt = formatTrainingExamples(agent, trainingExamples);
    const prompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;
    
    const result = await model.generateContent(prompt);
    if (!result || !result.response) {
      throw new Error('Failed to generate response from Gemini');
    }

    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Empty response received from Gemini');
    }

    return text;
  } catch (error: any) {
    console.error('Gemini API error:', error);
    
    // Handle specific Gemini API errors
    if (error.message?.includes('API_KEY')) {
      throw new Error('Invalid Gemini API key. Please contact an administrator.');
    }
    if (error.message?.includes('PERMISSION_DENIED')) {
      throw new Error('Access denied. Please check API key permissions.');
    }
    if (error.message?.includes('QUOTA_EXCEEDED')) {
      throw new Error('API quota exceeded. Please try again later.');
    }
    if (error.message?.includes('SAFETY')) {
      throw new Error('Message was blocked by content safety filters. Please try rephrasing.');
    }
    
    // Generic error with the original message
    throw new Error(error.message || 'Failed to get response from Gemini. Please try again.');
  }
}