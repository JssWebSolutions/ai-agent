import React from 'react';
import { Bot, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../../../utils/cn';

export function AgentStatus() {
  const agents = [
    { id: '1', name: 'Customer Support', status: 'online', lastActive: new Date() },
    { id: '2', name: 'Sales Assistant', status: 'offline', lastActive: new Date(Date.now() - 3600000) },
    { id: '3', name: 'Technical Support', status: 'online', lastActive: new Date() }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Agent Status</h3>
      <div className="space-y-4">
        {agents.map(agent => (
          <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{agent.name}</h4>
                <p className="text-sm text-gray-500">
                  Last active: {agent.lastActive.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className={cn(
              "flex items-center gap-2",
              agent.status === 'online' ? 'text-green-600' : 'text-gray-500'
            )}>
              {agent.status === 'online' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="text-sm font-medium capitalize">{agent.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}