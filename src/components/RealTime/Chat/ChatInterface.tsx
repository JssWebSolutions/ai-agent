import { useState, useRef, useEffect } from 'react';
import { useAgentStore } from '../../../store/agentStore';
import { useSpeechRecognition } from '../../../hooks/useSpeechRecognition';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { cn } from '../../../utils/cn';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedAgent, addInteraction } = useAgentStore();

  // Speech recognition setup
  const handleSpeechResult = (transcript: string) => {
    if (transcript.trim()) {
      handleSendMessage(transcript);
    }
  };

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    language: selectedAgent?.language || 'en',
    onResult: handleSpeechResult
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!selectedAgent || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setIsTyping(true);

    const startTime = Date.now();

    try {
      // Simulate API delay - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = `Response to: ${text}`; // Replace with actual API response

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'agent',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMessage]);

      const responseTime = (Date.now() - startTime) / 1000;
      await addInteraction(selectedAgent.id, {
        query: text,
        response,
        responseTime,
        successful: true,
        conversationId: Date.now().toString()
      });

    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      setIsProcessing(false);
      setIsTyping(false);
    }
  };

  if (!selectedAgent) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Please select an agent to start chatting
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 rounded-lg overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 bg-white border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            {selectedAgent.image ? (
              <img 
                src={selectedAgent.image} 
                alt={selectedAgent.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Bot className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{selectedAgent.name}</h2>
            <p className="text-sm text-gray-500">AI Assistant</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <ChatMessage key={message.id} {...message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onStartRecording={startListening}
        onStopRecording={stopListening}
        isRecording={isListening}
        disabled={isProcessing}
      />
    </div>
  );
}