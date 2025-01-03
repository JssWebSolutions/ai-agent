import { GoogleGenerativeAI } from '@google/generative-ai';
import { Agent } from '../../types/agent';
import { formatTrainingExamples, getDefaultTrainingExamples } from '../trainingData';

export async function getGeminiResponse(message: string, agent: Agent) {
  if (!agent.apiKeys?.gemini) {
    throw new Error('Gemini API key is required');
  }

  const genAI = new GoogleGenerativeAI(agent.apiKeys.gemini);
  const model = genAI.getGenerativeModel({ model: agent.model });

  try {
    // Get the default training examples if no additional ones are provided
    const trainingExamples = getDefaultTrainingExamples(agent);

    // Pass both agent and trainingExamples
    const systemPrompt = formatTrainingExamples(agent, trainingExamples);
    const prompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Gemini API error:', error);
    if (error.message?.includes('API key')) {
      throw new Error('Invalid Gemini API key. Please check your API key in the Settings tab.');
    }
    throw new Error(error.message);
  }
}
