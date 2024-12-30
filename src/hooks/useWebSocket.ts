import { useState, useEffect, useCallback, useRef } from 'react';
import { WS_CONFIG } from '../config/websocket';

interface WebSocketHook {
  lastMessage: string | null;
  sendMessage: (message: any) => void;
  readyState: number;
}

export function useWebSocket(endpoint: string): WebSocketHook {
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const retryCount = useRef(0);

  const connect = useCallback(() => {
    try {
      const url = `${WS_CONFIG.BASE_URL}${endpoint}`;
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log(`WebSocket connected to ${endpoint}`);
        setReadyState(WebSocket.OPEN);
        retryCount.current = 0;
      };

      ws.current.onmessage = (event) => {
        setLastMessage(event.data);
      };

      ws.current.onclose = () => {
        setReadyState(WebSocket.CLOSED);
        if (retryCount.current < WS_CONFIG.MAX_RETRIES) {
          reconnectTimeout.current = setTimeout(() => {
            retryCount.current++;
            connect();
          }, WS_CONFIG.RECONNECT_INTERVAL);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }, [endpoint]);

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  return { lastMessage, sendMessage, readyState };
}