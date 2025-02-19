import OpenAI from 'openai';
import { Agent } from '../../types/agent';
import { formatTrainingExamples, getDefaultTrainingExamples } from '../trainingData';

export async function getOpenAIResponse(message: string, agent: Agent, apiKey: string) {
  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });

  try {
    const trainingExamples = getDefaultTrainingExamples(agent);
    const systemPrompt = formatTrainingExamples(agent, trainingExamples);

    const response = await openai.chat.completions.create({
      model: agent.model,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0]?.message?.content || "I couldn't generate a response.";
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    if (error.status === 401) {
      throw new Error('Invalid OpenAI API key. Please contact an administrator.');
    }
    throw new Error(error.message);
  }
}