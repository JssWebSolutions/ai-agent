import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Image as ImageIcon, MoreVertical, Phone, Video, Info } from 'lucide-react';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { ChatSidebar } from './ChatSidebar';
import { cn } from '../../../utils/cn';

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
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <ChatSidebar 
        activeUsers={activeUsers}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium">H</span>
            </div>
            <div>
              <h2 className="font-semibold">Hazle</h2>
              <p className="text-sm text-gray-500">Active now</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Info className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
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

        {/* Input Area */}
        <div className="px-6 py-4 border-t">
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <label className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx"
                />
                <Paperclip className="w-5 h-5 text-gray-500" />
              </label>

              <label className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*"
                />
                <ImageIcon className="w-5 h-5 text-gray-500" />
              </label>
            </div>

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
              className={cn(
                "p-2 rounded-full transition-colors",
                inputMessage.trim() 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}