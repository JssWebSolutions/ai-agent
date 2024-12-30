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
  apiKeys?: {
    openai?: string;
    gemini?: string;
  };
  llmProvider: 'openai' | 'gemini';
  model: string;
  widgetSettings: WidgetSettings;
  trainingExamples: TrainingExample[];
  analytics: {
    interactions: Array<{
      id: string;
      conversationId: string;
      query: string;
      response: string;
      timestamp: Date;
      responseTime: number;
      successful: boolean;
    }>;
  };
}

// ... rest of the types remain the same