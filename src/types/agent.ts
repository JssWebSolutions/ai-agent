import { FieldValue } from 'firebase/firestore';

export type VoiceGender = 'male' | 'female';
export type VoiceAccent = 'neutral' | 'american' | 'british' | 'australian';
export type ResponseStyle = 'concise' | 'detailed';
export type InteractionMode = 'informative' | 'conversational' | 'support' | 'interactive';
export type LLMProvider = 'openai' | 'gemini';
export type WidgetTheme = 'light' | 'dark' | 'custom';
export type WidgetPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
export type WidgetButtonSize = 'small' | 'medium' | 'large';
export type WidgetBorderRadius = 'none' | 'small' | 'medium' | 'large';

export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4';
export type GeminiModel = 'gemini-pro';
export type AIModel = OpenAIModel | GeminiModel;

export interface VoiceSettings {
  gender: VoiceGender;
  pitch: number;
  speed: number;
  accent: VoiceAccent;
}

export interface WidgetCustomColors {
  primary: string;
  background: string;
  text: string;
}

export interface WidgetSettings {
  theme: WidgetTheme;
  position: WidgetPosition;
  buttonSize: WidgetButtonSize;
  borderRadius: WidgetBorderRadius;
  showAgentImage: boolean;
  customColors: WidgetCustomColors | null;
}

export interface TrainingExample {
  input: string;
  output: string;
  category: string;
}

export interface Interaction {
  id: string;
  conversationId: string;
  query: string;
  response: string;
  timestamp: Date;
  responseTime: number;
  successful: boolean;
}

export interface AgentAnalytics {
  interactions: Interaction[];
}

export interface AgentAPIKeys {
  openai: string | null;
  gemini: string | null;
}

export interface Agent {
  id: string;
  userId: string;
  name: string;
  image?: string;
  language: string;
  firstMessage: string;
  systemPrompt: string;
  voiceSettings: VoiceSettings;
  responseStyle: ResponseStyle;
  interactionMode: InteractionMode;
  behaviorRules: string[];
  llmProvider: LLMProvider;
  model: AIModel;
  widgetSettings: WidgetSettings;
  trainingExamples: TrainingExample[];
  analytics: AgentAnalytics;
  apiKeys: AgentAPIKeys;
  createdAt?: FieldValue;
  updatedAt?: FieldValue;
}

export interface AgentCreationData extends Omit<Agent, 'id' | 'createdAt' | 'updatedAt'> {}

export interface AgentUpdateData extends Partial<Omit<Agent, 'id' | 'userId' | 'createdAt' | 'updatedAt'>> {}

export interface AgentFilters {
  userId?: string;
  language?: string;
  llmProvider?: LLMProvider;
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  gender: 'female',
  pitch: 1,
  speed: 1,
  accent: 'neutral'
};

export const DEFAULT_WIDGET_SETTINGS: WidgetSettings = {
  theme: 'light',
  position: 'bottom-right',
  buttonSize: 'medium',
  borderRadius: 'medium',
  showAgentImage: true,
  customColors: null
};

export const DEFAULT_ANALYTICS: AgentAnalytics = {
  interactions: []
};

export const DEFAULT_API_KEYS: AgentAPIKeys = {
  openai: null,
  gemini: null
};

export const SUPPORTED_LANGUAGES = [
  'en', // English
  'es', // Spanish
  'fr', // French
  'de', // German
  'it', // Italian
  'pt', // Portuguese
  'ru', // Russian
  'zh', // Chinese
  'ja', // Japanese
  'ko', // Korean
  'ar', // Arabic
  'hi', // Hindi
  'bn', // Bengali
  'tr', // Turkish
  'nl'  // Dutch
] as const;

export const SUPPORTED_MODELS: Record<LLMProvider, readonly AIModel[]> = {
  openai: ['gpt-3.5-turbo', 'gpt-4'] as const,
  gemini: ['gemini-pro'] as const
};

export function isValidLanguage(lang: string): lang is typeof SUPPORTED_LANGUAGES[number] {
  return SUPPORTED_LANGUAGES.includes(lang as any);
}

export function isValidModel(provider: LLMProvider, model: string): model is AIModel {
  return SUPPORTED_MODELS[provider].includes(model as AIModel);
}

export function createDefaultAgent(userId: string): AgentCreationData {
  return {
    userId,
    name: 'AI Assistant',
    language: 'en',
    firstMessage: 'Hello! I am your AI assistant. How can I help you today?',
    systemPrompt: 'You are a helpful and friendly AI assistant. Always maintain your assigned identity and characteristics.',
    voiceSettings: DEFAULT_VOICE_SETTINGS,
    responseStyle: 'detailed',
    interactionMode: 'informative',
    behaviorRules: [
      'Always be helpful and friendly',
      'Maintain your assigned identity',
      'Use appropriate language and tone',
      'Be concise but informative'
    ],
    llmProvider: 'openai',
    model: 'gpt-3.5-turbo',
    widgetSettings: DEFAULT_WIDGET_SETTINGS,
    trainingExamples: [],
    analytics: DEFAULT_ANALYTICS,
    apiKeys: DEFAULT_API_KEYS
  };
}