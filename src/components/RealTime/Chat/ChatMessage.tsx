import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface ChatMessageProps {
  message: {
    text: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
  };
  isOwn: boolean;
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  return (
    <div className={cn(
      "flex",
      isOwn ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[70%] rounded-lg p-3",
        isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
      )}>
        <p>{message.text}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs opacity-70">
            {message.timestamp.toLocaleTimeString()}
          </span>
          {isOwn && (
            message.status === 'read' ? (
              <CheckCheck className="w-4 h-4 opacity-70" />
            ) : (
              <Check className="w-4 h-4 opacity-70" />
            )
          )}
        </div>
      </div>
    </div>
  );
}