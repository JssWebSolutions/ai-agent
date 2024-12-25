import React from 'react';
import { Agent } from '../../types/agent';

export const defaultAgent: Omit<Agent, 'id'> = {
  userId: "", // This will be populated when creating a new agent
  name: "AI Assistant",
  image: null, // Use null instead of undefined for optional fields
  language: "en", // Default language
  firstMessage: "Hello! How can I assist you today?", // Default initial message
  systemPrompt: "You are a helpful assistant.", // Default system behavior
  voiceSettings: {
    gender: "female", // Default voice settings
    pitch: 1,
    speed: 1,
    accent: "neutral",
  },
  responseStyle: "concise", // Default response style
  interactionMode: "informative", // Default interaction mode
  behaviorRules: [], // Default to no behavior rules
  apiKeys: {}, // No API keys by default
  llmProvider: "openai", // Default LLM provider
  model: "gpt-3.5-turbo", // Default model
  widgetSettings: {
    theme: "light", // Default widget settings
    position: "bottom-right",
    buttonSize: "medium",
    borderRadius: "medium",
    showAgentImage: true,
  },
  trainingExamples: [], // Default to no training examples
  analytics: {
    interactions: [], // No interactions by default
  },
};

export default defaultAgent;
