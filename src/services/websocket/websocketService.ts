import { WS_CONFIG } from '../../config/websocket';

export function createWebSocketConnection(endpoint: string) {
  const url = `${WS_CONFIG.BASE_URL}${endpoint}`;
  let ws: WebSocket | null = null;
  let retryCount = 0;
  let retryTimeout: NodeJS.Timeout;

  function connect() {
    try {
      ws = new WebSocket(url);
      
      ws.onopen = () => {
        console.log(`WebSocket connected to ${endpoint}`);
        retryCount = 0;
      };

      ws.onclose = () => {
        if (retryCount < WS_CONFIG.MAX_RETRIES) {
          retryTimeout = setTimeout(() => {
            retryCount++;
            connect();
          }, WS_CONFIG.RECONNECT_INTERVAL);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }

  function disconnect() {
    if (ws) {
      ws.close();
      clearTimeout(retryTimeout);
    }
  }

  function send(message: any) {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  connect();

  return {
    send,
    disconnect,
    getWebSocket: () => ws
  };
}