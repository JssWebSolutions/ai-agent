import { useAgentStore } from '../../store/agentStore';
import { Bot, Search, Circle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';

interface AgentListProps {
  onAgentSelect?: () => void;
}

export function AgentList({ onAgentSelect }: AgentListProps) {
  const { agents, selectedAgent, selectAgent } = useAgentStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAgentSelect = (agentId: string) => {
    selectAgent(agentId);
    onAgentSelect?.();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search Header */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Agent List */}
      <div className="flex-1 overflow-y-auto">
        {filteredAgents.map(agent => (
          <button
            key={agent.id}
            onClick={() => handleAgentSelect(agent.id)}
            className={cn(
              "w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors",
              selectedAgent?.id === agent.id && "bg-blue-50"
            )}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                {agent.image ? (
                  <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
                ) : (
                  <Bot className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <Circle className={cn(
                "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                "bg-green-500" // You can implement actual online/offline status logic
              )} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium text-gray-900">{agent.name}</h3>
              <p className="text-sm text-gray-500">
                {agent.llmProvider === 'openai' ? 'ChatGPT' : 'Gemini AI'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}