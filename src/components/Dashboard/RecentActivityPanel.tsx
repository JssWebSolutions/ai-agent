import{ useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAgentStore } from '../../store/agentStore';
import { cn } from '../../utils/cn';

interface Interaction {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
  conversationId: string;
}

interface Conversation {
  id: string;
  interactions: Interaction[];
  lastMessage: Date;
  agentName: string;
}

export function RecentActivityPanel() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [expandedConversationId, setExpandedConversationId] = useState<string | null>(null);
  const { agents } = useAgentStore();

  useEffect(() => {
    const fetchConversations = () => {
      const allInteractions = agents.reduce((acc, agent) => [
        ...acc,
        ...(agent.analytics?.interactions || []).map(interaction => ({
          ...interaction,
          agentName: agent.name
        }))
      ], [] as Array<Interaction & { agentName: string }>);

      const groupedConversations = allInteractions.reduce((acc, interaction) => {
        if (!interaction.conversationId) return acc;

        const conversation = acc.find(c => c.id === interaction.conversationId);
        if (conversation) {
          conversation.interactions.push(interaction);
          if (interaction.timestamp > conversation.lastMessage) {
            conversation.lastMessage = interaction.timestamp;
          }
        } else {
          acc.push({
            id: interaction.conversationId,
            interactions: [interaction],
            lastMessage: interaction.timestamp,
            agentName: interaction.agentName
          });
        }
        return acc;
      }, [] as Conversation[]);

      groupedConversations.sort((a, b) => b.lastMessage.getTime() - a.lastMessage.getTime());
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
            
            {/* Accordion content: show only if expanded */}
            {expandedConversationId === conversation.id && (
              <ul className="space-y-3">
                {conversation.interactions.slice(0, 3).map(interaction => (
                  <li key={interaction.id} className="p-3 bg-white rounded-md shadow border border-gray-300">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-gray-800">{interaction.query}</span>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(interaction.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <div className="bg-gray-100 p-3 rounded-md border border-gray-300">
                        <p className="text-gray-700">{interaction.response}</p>
                      </div>
                    </div>
                  </li>
                ))}
                {conversation.interactions.length > 3 && (
                  <li key={`${conversation.id}-more`} className="text-center text-sm text-gray-500">
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
