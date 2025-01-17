import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAgentStore } from '../../store/agentStore';
import { cn } from '../../utils/cn';
import { MessageSquare, ArrowLeft, Bot, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: string;
  agentName: string;
  agentImage?: string;
  agentId: string; // Added agentId for reference
  messages: Message[];
  lastActive: Date;
  unreadCount: number;
}

export function RecentActivityPanel() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { agents } = useAgentStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (expandedId) {
      const markMessagesAsRead = async () => {
        if (!user?.id) return;

        const conversation = conversations.find(c => c.id === expandedId);
        if (!conversation) return;

        try {
          const agentRef = doc(db, 'agents', conversation.agentId);
          const agentDoc = await getDoc(agentRef);

          if (!agentDoc.exists()) return;

          const updatedInteractions = agentDoc.data().analytics.interactions.map((interaction: any) => {
            if (interaction.conversationId === expandedId) {
              return { ...interaction, read: true };
            }
            return interaction;
          });

          await updateDoc(agentRef, {
            'analytics.interactions': updatedInteractions
          });

          // Update local state
          setConversations(prevConversations =>
            prevConversations.map(conversation => {
              if (conversation.id === expandedId) {
                return {
                  ...conversation,
                  messages: conversation.messages.map(message => ({
                    ...message,
                    read: true
                  })),
                  unreadCount: 0
                };
              }
              return conversation;
            })
          );
        } catch (error) {
          console.error('Error marking messages as read:', error);
          toast({
            title: 'Error',
            description: 'Failed to update message status',
            type: 'error'
          });
        }
      };

      markMessagesAsRead();
    }
  }, [expandedId, conversations, user?.id, toast]);

  useEffect(() => {
    const loadConversations = async () => {
      const newConversations = agents.reduce((acc: Conversation[], agent) => {
        const agentInteractions = agent.analytics.interactions || [];

        const conversationGroups = agentInteractions.reduce((groups: Record<string, any[]>, interaction) => {
          const conversationId = interaction.conversationId || 'default';
          if (!groups[conversationId]) {
            groups[conversationId] = [];
          }
          groups[conversationId].push(interaction);
          return groups;
        }, {});

        Object.entries(conversationGroups).forEach(([conversationId, interactions]) => {
          const messages: Message[] = interactions.flatMap(interaction => [
            {
              id: `${interaction.id}-query`,
              text: interaction.query,
              sender: 'user',
              timestamp: new Date(interaction.timestamp),
              read: false, // Default to unread
            },
            {
              id: `${interaction.id}-response`,
              text: interaction.response,
              sender: 'agent',
              timestamp: new Date(interaction.timestamp),
              read: false, // Default to unread
            },
          ]);

          messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

          const unreadCount = messages.filter(m => !m.read).length;

          acc.push({
            id: conversationId,
            agentName: agent.name,
            agentId: agent.id, // Include agentId
            agentImage: agent.image,
            messages,
            lastActive: new Date(Math.max(...messages.map(m => m.timestamp.getTime()))),
            unreadCount,
          });
        });

        return acc;
      }, []);

      newConversations.sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime());
      setConversations(newConversations);
      setIsLoading(false);
    };

    loadConversations();
  }, [agents]);

  // Mark messages as read when a conversation is expanded
  useEffect(() => {
    if (expandedId) {
      setConversations(prevConversations =>
        prevConversations.map(conversation => {
          if (conversation.id === expandedId) {
            const updatedMessages = conversation.messages.map(message => ({
              ...message,
              read: true, // Mark all as read
            }));

            return {
              ...conversation,
              messages: updatedMessages,
              unreadCount: 0, // Reset unread count
            };
          }
          return conversation;
        })
      );
    }
  }, [expandedId]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>Loading conversations...</p>
      </div>
    );
  }

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
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
        <button
          onClick={() => navigate('/user')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        <h2 className="text-xl font-semibold">Recent Activity</h2>
      </div>

      <div className="grid grid-cols-3 bg-gray-50 h-full rounded-lg overflow-hidden shadow-sm">
        <div className="col-span-1 bg-white shadow-sm overflow-auto max-h-[600px] border-r">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold">Conversations</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {conversations.map(conversation => (
              <div
                key={conversation.id}
                className={cn(
                  "hover:bg-gray-50 transition-colors p-4 cursor-pointer",
                  expandedId === conversation.id && "bg-blue-50"
                )}
                onClick={() => setExpandedId(expandedId === conversation.id ? null : conversation.id)}
              >
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
                        <Bot className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">{conversation.agentName}</h3>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(conversation.lastActive, { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Circle className={cn(
                        "w-2 h-2",
                        conversation.unreadCount > 0 ? "text-green-500" : "text-gray-400"
                      )} />
                      <span className="text-sm text-gray-500">
                        {conversation.unreadCount > 0 ? 'Unread messages' : 'All read'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 bg-white shadow-sm overflow-auto max-h-[600px]">
          {expandedId ? (
            <div className="p-6">
              {conversations
                .find(conversation => conversation.id === expandedId)
                ?.messages.map(message => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3 mb-4',
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] rounded-lg p-3 relative',
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      )}
                    >
                      <p>{message.text}</p>
                      <span className="text-xs opacity-75 mt-1 block">
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </span>
                      <div className={cn(
                        "absolute -bottom-5 right-2 text-xs",
                        message.read ? "text-gray-400" : "text-blue-600 font-medium"
                      )}>
                        {message.read ? 'Read' : 'Unread'}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-6 text-gray-500 text-center">
              <p>Select a conversation to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
