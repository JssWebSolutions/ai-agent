export interface ChatMetrics {
  activeChats: number;
  totalMessages: number;
  avgResponseTime: number;
  queueLength: number;
}

export interface ChatFilter {
  agent: string;
  status: string;
  period: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  agentId: string;
  agentName: string;
  userName: string;
  status: 'active' | 'pending' | 'closed';
  startTime: Date;
  messages: Message[];
}

export interface Agent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy';
  activeChats: number;
  lastActive: Date;
}

export interface Interaction {
  id: string;
  userId: string;
  agentId: string;
  agentName: string;
  userName: string;
  type: 'message' | 'action';
  content: string;
  timestamp: Date;
  duration: number;
  conversationId: string;
}