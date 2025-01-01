import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAgentStore } from '../../store/agentStore';
import { cn } from '../../utils/cn';
import { MessageSquare, MoreVertical, Phone, Video } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface Conversation {
  id: string;
  agentName: string;
  agentImage?: string;
  messages: Message[];
  lastActive: Date;
  isTyping?: boolean;
}

export function RecentActivityPanel() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { agents } = useAgentStore();

  useEffect(() => {
    // Transform agent interactions into conversations
    const newConversations = agents.map(agent => ({
      id: agent.id,
      agentName: agent.name,
      agentImage: agent.image,
      messages: agent.analytics.interactions.map(interaction => ({
        id: interaction.id || Math.random().toString(),
        text: interaction.query,
        sender: 'user' as const,
        timestamp: interaction.timestamp || new Date(),
        response: {
          id: Math.random().toString(),
          text: interaction.response,
          sender: 'agent' as const,
          timestamp: new Date(interaction.timestamp?.getTime() + 1000 || Date.now())
        }
      })).flat(),
      lastActive: agent.analytics.interactions[0]?.timestamp || new Date()
    }));

    setConversations(newConversations);
  }, [agents]);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
      </div>

      <div className="divide-y divide-gray-100">
        {conversations.map(conversation => (
          <div key={conversation.id} className="hover:bg-gray-50 transition-colors">
            <div 
              className="p-4 cursor-pointer"
              onClick={() => setExpandedId(expandedId === conversation.id ? null : conversation.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {conversation.agentImage ? (
                      <img 
                        src={conversation.agentImage} 
                        alt={conversation.agentName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                    {conversation.isTyping && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{conversation.agentName}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(conversation.lastActive, { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Phone className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Video className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {expandedId === conversation.id && (
              <div className="px-4 pb-4 space-y-4">
                {conversation.messages.slice(0, 3).map(message => (
                  <div 
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    )}>
                      <p>{message.text}</p>
                      <span className="text-xs opacity-75 mt-1 block">
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}