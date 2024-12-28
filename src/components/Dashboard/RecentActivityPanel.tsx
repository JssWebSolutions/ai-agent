import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAgentStore } from '../../store/agentStore';
import { cn } from '../../utils/cn';

interface Interaction {
  query: string;
  response: string;
  timestamp: Date;
  conversationId: string; // Unique ID to group by conversation
}

interface Conversation {
  id: string;
  interactions: Interaction[];
}

export function RecentActivityPanel() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { agents } = useAgentStore();

  useEffect(() => {
    const fetchConversations = () => {
      // Combine interactions from all agents
      const allInteractions = agents.reduce((acc, agent) => [
        ...acc,
        ...(agent.analytics?.interactions || [])
      ], [] as Interaction[]);

      // Group interactions by conversation ID
      const groupedConversations = allInteractions.reduce((acc, interaction) => {
        const conversation = acc.find(c => c.id === interaction.conversationId);
        if (conversation) {
          conversation.interactions.push(interaction);
        } else {
          acc.push({
            id: interaction.conversationId,
            interactions: [interaction],
          });
        }
        return acc;
      }, [] as Conversation[]);

      // Sort conversations and their interactions by timestamp
      groupedConversations.forEach(conversation => {
        conversation.interactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      });

      setConversations(groupedConversations);
    };

    fetchConversations();
  }, [agents]);

  return (
    <div className={cn(
      "bg-white p-6 rounded-lg shadow-lg border border-gray-200",
      "space-y-6 w-full mx-auto"
    )}>
      <h3 className="text-2xl font-semibold text-gray-800">Recent Activity</h3>

      {conversations.length > 0 ? (
        <div className="space-y-6">
          {conversations.map(conversation => (
            <div key={conversation.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800">
                Conversation ID: {conversation.id}
              </h4>
              <ul className="space-y-3 mt-3">
                {conversation.interactions.map((interaction, index) => (
                  <li key={`${conversation.id}-${index}`} className="p-3 bg-white rounded-md shadow border border-gray-300">
                    <div className="space-y-2">
                      {/* Query Section */}
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-gray-800">{interaction.query}</span>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(interaction.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      {/* Response Section */}
                      <div className="bg-gray-100 p-3 rounded-md border border-gray-300">
                        <p className="text-gray-700">{interaction.response || 'No response available'}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No recent activity available.</p>
      )}
    </div>
  );
}