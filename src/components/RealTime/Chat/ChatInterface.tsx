import{ useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Image as ImageIcon, Smile } from 'lucide-react';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { ChatMessage } from './ChatMessage';
import { UserPresence } from './UserPresence';
import { TypingIndicator } from './TypingIndicator';

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const { lastMessage, sendMessage } = useWebSocket('wss://your-websocket-url/chat');

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        switch (data.type) {
          case 'NEW_MESSAGE':
            setMessages(prev => [...prev, data.message]);
            break;
          case 'USER_PRESENCE':
            setActiveUsers(data.users);
            break;
          case 'TYPING_STATUS':
            setIsTyping(data.isTyping);
            break;
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const message = {
      text: inputMessage,
      timestamp: new Date(),
    };

    sendMessage({
      type: 'SEND_MESSAGE',
      message
    });

    setInputMessage('');
  };

  const handleTyping = () => {
    sendMessage({ type: 'TYPING_START' });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendMessage({ type: 'TYPING_STOP' });
    }, 1000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Handle file upload logic
    const reader = new FileReader();
    reader.onload = (e) => {
      sendMessage({
        type: 'SEND_FILE',
        file: {
          name: file.name,
          type: file.type,
          data: e.target?.result
        }
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <UserPresence users={activeUsers} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isOwn={message.sender === 'currentUser'}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx"
            />
            <Paperclip className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </label>

          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*"
            />
            <ImageIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </label>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSendMessage();
              handleTyping();
            }}
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />

          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}