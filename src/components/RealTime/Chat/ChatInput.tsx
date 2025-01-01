import { useState } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
  disabled?: boolean;
}

export function ChatInput({ 
  onSendMessage, 
  onStartRecording, 
  onStopRecording, 
  isRecording,
  disabled 
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={isRecording ? onStopRecording : onStartRecording}
          disabled={disabled}
          className={cn(
            "p-2 rounded-full transition-colors",
            isRecording 
              ? "bg-red-100 text-red-600 hover:bg-red-200" 
              : "hover:bg-gray-100"
          )}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={disabled}
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={cn(
            "p-2 rounded-full transition-colors",
            message.trim() && !disabled
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}