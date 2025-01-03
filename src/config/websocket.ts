// Declare a global configuration object for WebSocket
export const WS_CONFIG: {
  BASE_URL: string;
  ENDPOINTS: {
    ANALYTICS: string;
    CHAT: string;
  };
  RECONNECT_INTERVAL: number;
  MAX_RETRIES: number;
} = {
  // Use secure WebSocket when on HTTPS, regular WebSocket for HTTP
  BASE_URL: typeof window !== 'undefined' && window.location.protocol === 'https:'
    ? `wss://${window.location.host}`
    : `wss://${typeof window !== 'undefined' && window.location.host}`,
  ENDPOINTS: {
    ANALYTICS: '/ws/analytics',
    CHAT: '/ws/chat'
  },
  RECONNECT_INTERVAL: 5000,
  MAX_RETRIES: 3
};
