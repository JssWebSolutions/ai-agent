export interface WidgetConfig {
  agentId: string;
  theme?: 'light' | 'dark' | 'custom';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  customColors?: {
    primary: string;
    background: string;
    text: string;
  };
  buttonSize?: 'small' | 'medium' | 'large';
  borderRadius?: 'none' | 'small' | 'medium' | 'large';
  showAgentImage?: boolean;
  name?: string;
  image?: string;
  apiUrl?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export interface AgentInfo {
  name: string;
  image?: string;
  firstMessage?: string;
}