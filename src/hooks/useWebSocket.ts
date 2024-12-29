import { useState, useEffect, useCallback, useRef } from 'react';

interface WebSocketHook {
  lastMessage: string | null;
  sendMessage: (message: any) => void;
  readyState: number;
}

export function useWebSocket(url: string): WebSocketHook {
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log('WebSocket connected');
      setReadyState(WebSocket.OPEN);
    };

    socket.onmessage = (event) => {
      setLastMessage(event.data);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setReadyState(WebSocket.CLOSED);
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        ws.current = new WebSocket(url);
      }, 5000);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, [url]);

  const sendMessage = useCallback((message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  return { lastMessage, sendMessage, readyState };
}