import { Bot, CheckCircle, XCircle } from 'lucide-react';
import { Agent } from '../../../types/agent';
import { cn } from '../../../utils/cn';

interface AgentStatusProps {
  agents: Agent[];
}

export function AgentStatus({ agents }: AgentStatusProps) {
  if (agents.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center">
        <p className="text-gray-500">No agents available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Agent Status</h3>
      <div className="space-y-4">
        {agents.map(agent => {
          const lastInteraction = agent.analytics.interactions[0]?.timestamp;
          const isActive = lastInteraction && 
            (new Date().getTime() - new Date(lastInteraction).getTime()) < 3600000; // Active if interaction within last hour

          return (
            <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {agent.image ? (
                    <img 
                      src={agent.image} 
                      alt={agent.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <Bot className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{agent.name}</h4>
                  <p className="text-sm text-gray-500">
                    Last active: {lastInteraction ? new Date(lastInteraction).toLocaleTimeString() : 'Never'}
                  </p>
                </div>
              </div>
              <div className={cn(
                "flex items-center gap-2",
                isActive ? 'text-green-600' : 'text-gray-500'
              )}>
                {isActive ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                <span className="text-sm font-medium capitalize">
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}