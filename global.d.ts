// global.d.ts
interface Window {
    voiceAIConfig?: {
      customColors?: string | Record<string, string> | null;
      [key: string]: any; // Extend as needed
    };
  }
  