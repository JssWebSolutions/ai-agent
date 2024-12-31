import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAgentStore } from '../../store/agentStore';
import { cn } from '../../utils/cn';
import { Interaction } from '../../types/agent';

interface ConversationWithAgent extends Interaction {
  agentName: string;
}

interface GroupedConversation {
  id: string;
  interactions: ConversationWithAgent[];
  lastMessage: Date;
  agentName: string;
}

export function RecentActivityPanel() {
  const [conversations, setConversations] = useState<GroupedConversation[]>([]);
  const [expandedConversationId, setExpandedConversationId] = useState<string | null>(null);
  const { agents } = useAgentStore();

  useEffect(() => {
    const fetchConversations = () => {
      // Collect all interactions with agent names
      const allInteractions: ConversationWithAgent[] = agents.flatMap(agent => 
        (agent.analytics?.interactions || []).map(interaction => ({
          ...interaction,
          agentName: agent.name || 'Unnamed Agent'
        }))
      );

      // Group interactions by conversation ID
      const groupedConversations = allInteractions.reduce<GroupedConversation[]>((acc, interaction) => {
        if (!interaction.conversationId) return acc;

        const existingConversation = acc.find(c => c.id === interaction.conversationId);
        if (existingConversation) {
          existingConversation.interactions.push(interaction);
          if ((interaction.timestamp ?? 0) > existingConversation.lastMessage) {
            existingConversation.lastMessage = interaction.timestamp ?? new Date();
          }
        } else {
          acc.push({
            id: interaction.conversationId,
            interactions: [interaction],
            lastMessage: interaction.timestamp ?? new Date(),
            agentName: interaction.agentName
          });
        }
        return acc;
      }, []);

      // Sort conversations by most recent message
      groupedConversations.sort((a, b) => b.lastMessage.getTime() - a.lastMessage.getTime());
      
      // Take only the 5 most recent conversations
      setConversations(groupedConversations.slice(0, 5));
    };

    fetchConversations();
  }, [agents]);

  const toggleAccordion = (conversationId: string) => {
    setExpandedConversationId(prev => prev === conversationId ? null : conversationId);
  };

  if (!conversations?.length) {
    return (
      <div className={cn(
        "bg-white p-6 rounded-lg shadow-lg border border-gray-200",
        "space-y-6 w-full mx-auto"
      )}>
        <h3 className="text-2xl font-semibold text-gray-800">Recent Activity</h3>
        <p className="text-center text-gray-500">No recent activity available.</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-white p-6 rounded-lg shadow-lg border border-gray-200",
      "space-y-6 w-full mx-auto"
    )}>
      <h3 className="text-2xl font-semibold text-gray-800">Recent Activity</h3>
      <div className="space-y-6">
        {conversations.map(conversation => (
          <div key={conversation.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
            <div
              className="flex justify-between items-center mb-2 cursor-pointer"
              onClick={() => toggleAccordion(conversation.id)}
            >
              <h4 className="text-lg font-semibold text-gray-800">
                Conversation with {conversation.agentName}
              </h4>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(conversation.lastMessage, { addSuffix: true })}
              </span>
            </div>
            
            {expandedConversationId === conversation.id && (
              <ul className="space-y-3">
                {conversation.interactions.slice(0, 3).map(interaction => (
                  <li key={interaction.id} className="p-3 bg-white rounded-md shadow border border-gray-300">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-gray-800">{interaction.query}</span>
                        <span className="text-sm text-gray-500">
                          {interaction.timestamp ? formatDistanceToNow(interaction.timestamp, { addSuffix: true }) : 'Unknown time'}
                        </span>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-md border border-gray-300">
                        <p className="text-gray-700">{interaction.response}</p>
                      </div>
                    </div>
                  </li>
                ))}
                {conversation.interactions.length > 3 && (
                  <li className="text-center text-sm text-gray-500">
                    + {conversation.interactions.length - 3} more messages
                  </li>
                )}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}