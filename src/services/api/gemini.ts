import { GoogleGenerativeAI } from '@google/generative-ai';
import { Agent } from '../../types/agent';
import { formatTrainingExamples, getDefaultTrainingExamples } from '../trainingData';

export async function getGeminiResponse(message: string, agent: Agent, apiKey: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: agent.model });

  try {
    const trainingExamples = getDefaultTrainingExamples(agent);
    const systemPrompt = formatTrainingExamples(agent, trainingExamples);
    const prompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Gemini API error:', error);
    if (error.message?.includes('API key')) {
      throw new Error('Invalid Gemini API key. Please contact an administrator.');
    }
    throw new Error(error.message);
  }
}