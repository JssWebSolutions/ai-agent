import { env } from './env';

export const WS_CONFIG = {
  // Use secure WebSocket when on HTTPS, regular WebSocket for HTTP
  BASE_URL: window.location.protocol === 'https:' 
    ? `wss://${window.location.host}`
    : `ws://${window.location.host}`,
  ENDPOINTS: {
    ANALYTICS: '/ws/analytics',
    CHAT: '/ws/chat'
  },
  RECONNECT_INTERVAL: 5000,
  MAX_RETRIES: 3
};