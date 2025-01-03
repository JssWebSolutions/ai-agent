export interface VoiceSettings {
  gender: 'male' | 'female';
  pitch: number;
  speed: number;
  accent: string;
}

export type ResponseStyle = 'concise' | 'detailed';
export type InteractionMode = 'informative' | 'conversational' | 'support' | 'interactive';

export interface WidgetSettings {
  theme: 'light' | 'dark' | 'custom';
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  buttonSize: 'small' | 'medium' | 'large';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  showAgentImage: boolean;
  customColors: {
    primary: string;
    background: string;
    text: string;
  } | null;
}

export interface TrainingExample {
  input: string;
  output: string;
  category: string;
}

export interface Interaction {
  id?: string;
  conversationId?: string;
  query: string;
  response: string;
  timestamp?: Date;
  responseTime: number;
  successful: boolean;
}

export interface Agent {
  createdAt: any;
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
  apiKeys?: {
    openai?: string;
    gemini?: string;
  };
  llmProvider: 'openai' | 'gemini';
  model: string;
  widgetSettings: WidgetSettings;
  trainingExamples: TrainingExample[];
  analytics: {
    interactions: Interaction[];
  };
}
