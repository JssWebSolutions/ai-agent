import { Agent } from '../../types/agent';

export const defaultAgent: Omit<Agent, 'id'> = {
  userId: "",
  name: "AI Assistant",
  image: undefined,
  language: "en",
  firstMessage: "Hello! How can I assist you today?",
  systemPrompt: "You are a helpful assistant.",
  voiceSettings: {
    gender: "female",
    pitch: 1,
    speed: 1,
    accent: "neutral",
    volume: 0,
    rate: 0
  },
  responseStyle: "concise",
  interactionMode: "informative",
  behaviorRules: [],
  llmProvider: "openai",
  model: "gpt-3.5-turbo",
  widgetSettings: {
    theme: "light",
    position: "bottom-right",
    buttonSize: "medium",
    borderRadius: "medium",
    showAgentImage: true,
    customColors: null
  },
  trainingExamples: [],
  analytics: {
    interactions: [],
  },
  apiKeys: {
    openai: null,
    gemini: null
  }
};

export default defaultAgent;