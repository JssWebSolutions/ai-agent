import { useState, useRef, useEffect } from 'react';
import { Agent } from '../../types/agent';
import { Menu, Bot, Send, Mic, MicOff } from 'lucide-react';
import { MessageList } from './MessageList';
import { useChatState } from '../../hooks/useChatState';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useVoiceSynthesis } from '../../hooks/useVoiceSynthesis';
import { getChatResponse } from '../../services/api';
import { useAgentStore } from '../../store/agentStore';
import { LoadingSpinner } from '../LoadingSpinner';
import { useToast } from '../../contexts/ToastContext';
import { Message } from '@/types/chat';
import { incrementMessageCount } from '@/services/subscription/usage';

interface ChatWindowProps {
  agent: Agent;
  onMenuToggle: () => void;
}

export function ChatWindow({ agent, onMenuToggle }: ChatWindowProps) {
  const [inputMessage, setInputMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, isLoading, addMessage, setIsTyping } = useChatState();
  const [isProcessing, setIsProcessing] = useState(false);
  const { addInteraction } = useAgentStore();
  const { speak } = useVoiceSynthesis();
  const { toast } = useToast();

  const handleSpeechResult = (transcript: string) => {
    if (transcript.trim()) {
      handleSendMessage(transcript);
    }
  };

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    language: agent.language,
    onResult: handleSpeechResult,
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [agent.id]);

  const handleSendMessage = async (text: string) => {
    if (!agent || isProcessing) return;
  
    try {
      const canSendMessage = await incrementMessageCount(agent.userId);
  
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
  
      const response = await getChatResponse(text, agent);
  
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'agent',
        timestamp: new Date(),
      };
  
      addMessage(agentMessage);
  
      const responseTime = (Date.now() - startTime) / 1000;
      await addInteraction(agent.id, {
        query: text,
        response,
        responseTime,
        successful: true,
        conversationId: Date.now().toString(),
      });
  
      if ('speechSynthesis' in window) {
        speak(response, agent);
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
          {agent.image ? (
            <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
          ) : (
            <Bot className="w-5 h-5 text-blue-600" />
          )}
        </div>
        <div>
          <h2 className="font-medium text-gray-900">{agent.name}</h2>
          <p className="text-sm text-gray-500">
            {agent.llmProvider === 'openai' ? 'ChatGPT' : 'Gemini AI'}
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
