import React from 'react';
import { Agent } from '../../types/agent';
import { Bot } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';

interface AgentListProps {
  agents?: Agent[];
}

export function AgentList({ agents }: AgentListProps) {
  if (!agents) {
    return <div className="text-center py-8 text-gray-500">Loading agents...</div>;
  }

  if (agents.length === 0) {
    return <div className="text-center py-8 text-gray-500">No agents found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {agents.map((agent) => (
        <Link to={`/agent/${agent.id}`} key={agent.id} className={cn(
          "bg-white rounded-lg shadow p-6 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all duration-200",
          "group"
        )}>
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
            {agent.image ? (
              <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
            ) : (
              <Bot className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
            <p className="text-sm text-gray-500">
              {agent.llmProvider} - {agent.language}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
