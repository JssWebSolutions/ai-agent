import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Agent } from '../types/agent';
import { getDefaultTrainingExamples, formatTrainingExamples } from './trainingData';
import { getAPICredentials } from './admin/apiCredentials';

export async function getChatResponse(message: string, agent: Agent) {
  try {
    const apiKey = await getAPICredentials(agent.llmProvider);
    
    if (agent.llmProvider === 'openai') {
      return getOpenAIResponse(message, agent, apiKey);
    } else {
      return getGeminiResponse(message, agent, apiKey);
    }
  } catch (error: any) {
    console.error('API error:', error);
    throw new Error('Please contact support to configure API settings');
  }
}

async function getOpenAIResponse(message: string, agent: Agent, apiKey: string) {
  try {
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });

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

    if (!response.choices[0]?.message?.content) {
      throw new Error('No response generated. Please try again.');
    }

    return response.choices[0].message.content;
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    if (error.status === 401) {
      throw new Error('Invalid OpenAI API key. Please contact an administrator.');
    }
    if (error.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    }
    if (error.status === 500) {
      throw new Error('OpenAI service error. Please try again later.');
    }
    throw new Error(error.message || 'Failed to get response from OpenAI. Please try again.');
  }
}

async function getGeminiResponse(message: string, agent: Agent, apiKey: string) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: agent.model });

    const trainingExamples = getDefaultTrainingExamples(agent);
    const systemPrompt = formatTrainingExamples(agent, trainingExamples);
    const prompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('No response generated. Please try again.');
    }

    return text;
  } catch (error: any) {
    console.error('Gemini API error:', error);
    if (error.message?.includes('API key')) {
      throw new Error('Invalid Gemini API key. Please contact an administrator.');
    }
    if (error.message?.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.');
    }
    if (error.message?.includes('blocked')) {
      throw new Error('The message was blocked by content filters. Please try rephrasing.');
    }
    throw new Error(error.message || 'Failed to get response from Gemini. Please try again.');
  }
}