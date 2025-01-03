import { useState, useEffect } from 'react';
import { MessageSquare, User, Clock } from 'lucide-react';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface Conversation {
  id: string;
  userId: string;
  agentId: string;
  agentName: string;
  userName: string;
  status: 'active' | 'pending' | 'closed';
  startTime: Date;
  messages: Message[];
}

export function LiveConversations({ filter }: { filter: any }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { lastMessage } = useWebSocket('/analytics');

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        if (data.type === 'CONVERSATIONS_UPDATE') {
          setConversations(data.conversations);
        }
      } catch (error) {
        console.error('Error parsing conversations:', error);
      }
    }
  }, [lastMessage]);

  const filteredConversations = conversations.filter(conv => {
    if (filter.agent !== 'all' && conv.agentId !== filter.agent) return false;
    if (filter.status !== 'all' && conv.status !== filter.status) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold">Live Conversations</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {filteredConversations.map(conversation => (
          <div key={conversation.id} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center ring-2 ring-white">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center ring-2 ring-white">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">{conversation.userName}</p>
                  <p className="text-sm text-gray-500">with {conversation.agentName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{formatDistanceToNow(conversation.startTime, { addSuffix: true })}</span>
              </div>
            </div>
            <div className="space-y-3">
              {conversation.messages.slice(-3).map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.text}</p>
                    <span className="text-xs opacity-75 mt-1 block">
                      {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}