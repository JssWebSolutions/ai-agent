import { useRef, useEffect } from 'react';
import { Bot, User } from 'lucide-react';
import { cn } from '../../utils/cn';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex items-start gap-3",
            message.sender === 'user' ? 'flex-row-reverse' : ''
          )}
        >
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
            message.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'
          )}>
            {message.sender === 'user' ? (
              <User className="w-5 h-5 text-blue-600" />
            ) : (
              <Bot className="w-5 h-5 text-gray-600" />
            )}
          </div>

          <div className={cn(
            "max-w-[70%] rounded-lg p-3",
            message.sender === 'user' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white border border-gray-200'
          )}>
            <p className="whitespace-pre-wrap">{message.text}</p>
            <span className={cn(
              "text-xs mt-1 block",
              message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
            )}>
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}