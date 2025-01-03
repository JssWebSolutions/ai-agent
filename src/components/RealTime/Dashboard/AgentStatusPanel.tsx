import { useState, useEffect } from 'react';
import { User, Circle } from 'lucide-react';
import { useWebSocket } from '../../../hooks/useWebSocket';

interface Agent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy';
  activeChats: number;
  lastActive: Date;
}

export function AgentStatusPanel({ filter }: { filter: any }) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const { lastMessage } = useWebSocket('/analytics');

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        if (data.type === 'AGENT_STATUS') {
          setAgents(data.agents);
        }
      } catch (error) {
        console.error('Error parsing agent status:', error);
      }
    }
  }, [lastMessage]);

  const filteredAgents = agents.filter(agent => {
    if (filter.status !== 'all' && agent.status !== filter.status) return false;
    return true;
  });

  const statusColors = {
    online: 'text-green-500',
    offline: 'text-gray-500',
    busy: 'text-yellow-500'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold">Agent Status</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {filteredAgents.map(agent => (
          <div key={agent.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">{agent.name}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <Circle className={`w-2 h-2 ${statusColors[agent.status]}`} />
                    <span className="capitalize">{agent.status}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Active Chats</p>
                <p className="font-medium">{agent.activeChats}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}