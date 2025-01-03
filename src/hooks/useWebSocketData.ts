import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

export function useWebSocketData<T>(endpoint: string, messageType: string) {
  const [data, setData] = useState<T | null>(null);
  const { lastMessage } = useWebSocket(endpoint);

  useEffect(() => {
    if (lastMessage) {
      try {
        const parsedData = JSON.parse(lastMessage);
        if (parsedData.type === messageType) {
          setData(parsedData.data);
        }
      } catch (error) {
        console.error(`Error parsing ${messageType} data:`, error);
      }
    }
  }, [lastMessage, messageType]);

  return data;
}