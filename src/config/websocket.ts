import { env } from './env';

export const WS_CONFIG = {
  // Use environment variable or fallback to secure WebSocket on same host
  BASE_URL: env.production 
    ? `wss://${window.location.host}`
    : `ws://${window.location.host}`,
  ENDPOINTS: {
    ANALYTICS: '/ws/analytics',
    CHAT: '/ws/chat'
  },
  RECONNECT_INTERVAL: 5000,
  MAX_RETRIES: 3
};