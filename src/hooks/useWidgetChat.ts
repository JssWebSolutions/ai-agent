import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Agent } from '../types/agent';
import { getChatResponse } from '../services/api';
import { useVoiceSynthesis } from './useVoiceSynthesis';
import { useSpeechRecognition } from './useSpeechRecognition';
import { useApiKeys } from './useApiKeys';
import { useAgentStore } from '../store/agentStore';
import { useLoadingToast } from './useLoadingToast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export function useWidgetChat(agent: Agent) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      text: agent.firstMessage,
      sender: 'agent',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationId] = useState(() => uuidv4());
  const { speak } = useVoiceSynthesis();
  const { validateApiKey } = useApiKeys();
  const { addInteraction } = useAgentStore();
  const { showLoading, hideLoading } = useLoadingToast();

  // Initialize speech recognition
  const handleSpeechResult = useCallback((transcript: string) => {
    if (transcript.trim()) {
      handleMessage(transcript);
    }
  }, []);

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    language: agent.language,
    onResult: handleSpeechResult
  });

  const handleMessage = async (text: string) => {
    if (!text.trim() || !agent || isProcessing) return;

    if (!validateApiKey(agent)) return;

    setIsProcessing(true);
    showLoading('Processing message...');

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    const startTime = Date.now();

    try {
      const response = await getChatResponse(text, agent);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'agent',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      const responseTime = (Date.now() - startTime) / 1000;
      await addInteraction(agent.id, {
        query: text,
        response,
        responseTime,
        successful: true,
        conversationId
      });

      if ('speechSynthesis' in window) {
        speak(response, agent);
      }
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred";
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: 'agent',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      const responseTime = (Date.now() - startTime) / 1000;
      await addInteraction(agent.id, {
        query: text,
        response: errorMessage,
        responseTime,
        successful: false,
        conversationId
      });
    } finally {
      setIsProcessing(false);
      hideLoading();
    }
  };

  return {
    messages,
    inputMessage,
    isListening,
    isProcessing,
    setInputMessage,
    sendMessage: handleMessage,
    startListening,
    stopListening,
    conversationId
  };
}