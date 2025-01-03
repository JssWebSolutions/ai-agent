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
}

export function RecentActivityPanel() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { agents } = useAgentStore();

  useEffect(() => {
    // Transform agent interactions into conversations
    const newConversations = agents.reduce((acc: Conversation[], agent) => {
      const agentInteractions = agent.analytics.interactions || [];
      
      // Group interactions by conversation ID
      const conversationGroups = agentInteractions.reduce((groups: Record<string, any[]>, interaction) => {
        const conversationId = interaction.conversationId || 'default';
        if (!groups[conversationId]) {
          groups[conversationId] = [];
        }
        groups[conversationId].push(interaction);
        return groups;
      }, {});

      // Convert each group into a conversation
      Object.entries(conversationGroups).forEach(([conversationId, interactions]) => {
        const messages: Message[] = interactions.flatMap(interaction => [
          {
            id: `${interaction.id}-query`,
            text: interaction.query,
            sender: 'user',
            timestamp: new Date(interaction.timestamp)
          },
          {
            id: `${interaction.id}-response`,
            text: interaction.response,
            sender: 'agent',
            timestamp: new Date(interaction.timestamp)
          }
        ]);

        // Sort messages by timestamp
        messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        acc.push({
          id: conversationId,
          agentName: agent.name,
          agentImage: agent.image,
          messages,
          lastActive: new Date(Math.max(...messages.map(m => m.timestamp.getTime())))
        });
      });

      return acc;
    }, []);

    // Sort conversations by last active timestamp
    newConversations.sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime());
    setConversations(newConversations);
  }, [agents]);

  if (conversations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>No recent conversations yet.</p>
        <p className="text-sm mt-2">Start chatting with your agents to see activity here.</p>
      </div>
    );
  }

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
                {conversation.messages.slice(0, 6).map(message => (
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