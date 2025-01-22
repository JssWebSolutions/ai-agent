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
  llmProvider: 'openai' | 'gemini';
  model: string;
  widgetSettings: WidgetSettings;
  trainingExamples: TrainingExample[];
  analytics: {
    interactions: Interaction[];
  };
  apiKeys: {
    openai: null;
    gemini: null;
  };
  createdAt?: FieldValue;
  updatedAt?: FieldValue;
}