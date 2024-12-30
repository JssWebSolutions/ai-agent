import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../utils/cn';

interface Interaction {
  id: string;
  conversationId: string;
  query: string;
  response: string;
  timestamp: Date;
  responseTime: number;
  successful: boolean;
}

interface InteractionsListProps {
  interactions: Interaction[];
}

export function InteractionsList({ interactions }: InteractionsListProps) {
  const [expandedConversation, setExpandedConversation] = useState<string | null>(null);

  // Group interactions by conversation
  const conversations = React.useMemo(() => {
    const grouped = interactions.reduce((acc, interaction) => {
      if (!interaction.conversationId) return acc; // Skip if no conversationId
      
      const existing = acc.find(c => c.id === interaction.conversationId);
      if (existing) {
        existing.interactions.push(interaction);
      } else {
        acc.push({
          id: interaction.conversationId,
          interactions: [interaction]
        });
      }
      return acc;
    }, [] as Array<{ id: string; interactions: Interaction[] }>);

    // Sort conversations by most recent interaction
    return grouped.sort((a, b) => {
      const aLatest = Math.max(...a.interactions.map(i => i.timestamp.getTime()));
      const bLatest = Math.max(...b.interactions.map(i => i.timestamp.getTime()));
      return bLatest - aLatest;
    });
  }, [interactions]);

  if (!interactions?.length || !conversations?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No interactions recorded yet. Start chatting with your agent to see analytics.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {conversations.map((conversation) => (
        <div key={conversation.id} className="border rounded-lg overflow-hidden">
          <div 
            className={cn(
              "bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors",
              "flex justify-between items-center"
            )}
            onClick={() => setExpandedConversation(
              expandedConversation === conversation.id ? null : conversation.id
            )}
          >
            <div>
              <h3 className="font-medium">
                Conversation {conversation.id?.slice(0, 8) || 'Unknown'}
              </h3>
              <p className="text-sm text-gray-500">
                {conversation.interactions.length} messages
              </p>
            </div>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(
                Math.max(...conversation.interactions.map(i => i.timestamp.getTime())),
                { addSuffix: true }
              )}
            </span>
          </div>

          {expandedConversation === conversation.id && (
            <div className="divide-y">
              {conversation.interactions.map((interaction) => (
                <div key={interaction.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium">{interaction.query}</p>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(interaction.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700">{interaction.response}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <span>Response Time: {interaction.responseTime.toFixed(1)}s</span>
                    <span className={cn(
                      "px-2 py-1 rounded",
                      interaction.successful ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    )}>
                      {interaction.successful ? 'Successful' : 'Failed'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}