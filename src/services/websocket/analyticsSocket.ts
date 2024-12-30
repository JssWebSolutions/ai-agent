import { WS_CONFIG } from '../../config/websocket';
import { createWebSocketConnection } from './websocketService';

export function createAnalyticsSocket() {
  return createWebSocketConnection(WS_CONFIG.ENDPOINTS.ANALYTICS);
}

export interface AnalyticsMessage {
  type: 'METRICS_UPDATE' | 'AGENT_STATUS' | 'ERROR';
  data?: any;
  error?: string;
}

export function parseAnalyticsMessage(message: string): AnalyticsMessage {
  try {
    return JSON.parse(message);
  } catch {
    return { type: 'ERROR', error: 'Invalid message format' };
  }
}