import { useState, useRef, useEffect } from 'react';
import { Bot, Menu, Send, Mic, MicOff } from 'lucide-react';
import { MessageList } from './MessageList';
import { useChatState } from '../../../hooks/useChatState';
import { useSpeechRecognition } from '../../../hooks/useSpeechRecognition';
import { useVoiceSynthesis } from '../../../hooks/useVoiceSynthesis';
import { getChatResponse } from '../../../services/api';
import { useAgentStore } from '../../../store/agentStore';
import { LoadingSpinner } from '../../LoadingSpinner';
import { useToast } from '../../../contexts/ToastContext';
import { Message } from '@/types/chat';
import { incrementMessageCount } from '@/services/subscription/usage';
import { getAPIKeys } from '../../../services/admin/apiKeys';

interface ChatInterfaceProps {
  onMenuToggle: () => void;
}

export function ChatInterface({ onMenuToggle }: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, isLoading, addMessage } = useChatState();
  const [isProcessing, setIsProcessing] = useState(false);
  const { selectedAgent, addInteraction } = useAgentStore();
  const { speak } = useVoiceSynthesis();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<{ openai?: string; gemini?: string } | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const loadApiKeys = async () => {
      try {
        const keys = await getAPIKeys();
        setApiKeys(keys || {});
      } catch (error) {
        console.error('Error loading API keys:', error);
        toast({
          title: 'Error',
          description: 'Failed to load API configuration. Please contact an administrator.',
          type: 'error'
        });
      }
    };
    loadApiKeys();
  }, [toast]);

  const handleSpeechResult = (transcript: string) => {
    if (transcript.trim()) {
      handleSendMessage(transcript);
    }
  };

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    language: selectedAgent?.language || 'en',
    onResult: handleSpeechResult,
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedAgent?.id]);

  const handleSendMessage = async (text: string) => {
    if (!selectedAgent || isProcessing) return;

    // Check if API keys are available
    if (!apiKeys) {
      toast({
        title: 'Error',
        description: 'Chat is not available. Please contact an administrator to configure API keys.',
        type: 'error'
      });
      return;
    }

    if (selectedAgent.llmProvider === 'openai' && !apiKeys.openai) {
      toast({
        title: 'Error',
        description: 'OpenAI API key is not configured. Please contact an administrator.',
        type: 'error'
      });
      return;
    }

    if (selectedAgent.llmProvider === 'gemini' && !apiKeys.gemini) {
      toast({
        title: 'Error',
        description: 'Gemini API key is not configured. Please contact an administrator.',
        type: 'error'
      });
      return;
    }

    try {
      const canSendMessage = await incrementMessageCount(selectedAgent.userId);
  
      if (!canSendMessage) {
        toast({
          title: 'Message Limit Reached',
          description: 'You have reached your monthly message limit. Please upgrade your plan to continue.',
          type: 'error',
        });
        return;
      }
  
      const userMessage: Message = {
        id: Date.now().toString(),
        text,
        sender: 'user',
        timestamp: new Date(),
      };
  
      addMessage(userMessage);
      setInputMessage('');
      setIsProcessing(true);
      setIsTyping(true);
  
      const startTime = Date.now();
  
      const response = await getChatResponse(text, selectedAgent);
  
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'agent',
        timestamp: new Date(),
      };
  
      addMessage(agentMessage);
  
      const responseTime = (Date.now() - startTime) / 1000;
      await addInteraction(selectedAgent.id, {
        query: text,
        response,
        responseTime,
        successful: true,
        conversationId: Date.now().toString(),
      });
  
      if ('speechSynthesis' in window) {
        speak(response, selectedAgent);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message. Please try again.',
        type: 'error',
      });
    } finally {
      setIsProcessing(false);
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  if (!selectedAgent) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Please select an agent to start chatting
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
          {selectedAgent.image ? (
            <img src={selectedAgent.image} alt={selectedAgent.name} className="w-full h-full object-cover" />
          ) : (
            <Bot className="w-5 h-5 text-blue-600" />
          )}
        </div>
        <div>
          <h2 className="font-medium text-gray-900">{selectedAgent.name}</h2>
          <p className="text-sm text-gray-500">
            {selectedAgent.llmProvider === 'openai' ? 'ChatGPT' : 'Gemini AI'}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <MessageList messages={messages} />

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`p-2 rounded-full transition-colors ${
              isListening ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'
            }`}
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}