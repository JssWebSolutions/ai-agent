import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../../utils/cn';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export function ChatMessage({ text, sender, timestamp }: ChatMessageProps) {
  return (
    <div className={cn(
      "flex gap-3",
      sender === 'user' ? 'justify-end' : 'justify-start'
    )}>
      {sender === 'agent' && (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center">
          <Bot className="w-4 h-4 text-blue-600" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] rounded-lg p-3",
        sender === 'user' 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-900'
      )}>
        <p className="whitespace-pre-wrap">{text}</p>
        <span className="text-xs opacity-75 mt-1 block">
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
      </div>

      {sender === 'user' && (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center">
          <User className="w-4 h-4 text-blue-600" />
        </div>
      )}
    </div>
  );
}