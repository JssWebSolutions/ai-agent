import { useState, useEffect } from 'react';
import { Bot, User, Clock } from 'lucide-react';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { formatDistanceToNow } from 'date-fns';

interface Interaction {
  id: string;
  userId: string;
  agentId: string;
  agentName: string;
  userName: string;
  type: 'message' | 'action';
  content: string;
  timestamp: Date;
  duration: number;
  conversationId: string;
  successful: boolean;
}

export function WidgetInteractions({ filter }: { filter: any }) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const { lastMessage } = useWebSocket('/analytics');

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        if (data.type === 'INTERACTIONS_UPDATE') {
          setInteractions(data.interactions);
        }
      } catch (error) {
        console.error('Error parsing interactions:', error);
      }
    }
  }, [lastMessage]);

  const filteredInteractions = interactions.filter(interaction => {
    if (filter.agent !== 'all' && interaction.agentId !== filter.agent) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold">Widget Interactions</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agent
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredInteractions.map(interaction => (
              <tr key={interaction.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{interaction.userName}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-blue-500" />
                    <span>{interaction.agentName}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    interaction.type === 'message'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {interaction.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-gray-900 truncate max-w-xs">
                    {interaction.content}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {formatDistanceToNow(interaction.timestamp, { addSuffix: true })}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {interaction.duration}s
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}