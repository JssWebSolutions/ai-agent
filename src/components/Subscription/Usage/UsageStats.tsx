import React from 'react';
import { MessageCircle, Users, HardDrive, AlertTriangle } from 'lucide-react';
import { Usage } from '../../../types/subscription';
import { Plan } from '../../../types/subscription';

interface UsageStatsProps {
  usage: Usage;
  plan: Plan;
}

export function UsageStats({ usage, plan }: UsageStatsProps) {
  const messagePercentage = (usage.metrics.totalMessages / plan.limits.messagesPerMonth) * 100;
  const agentPercentage = (usage.metrics.totalAgents / plan.limits.agentsPerAccount) * 100;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Usage Statistics</h2>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="flex items-center text-gray-700">
              <MessageCircle className="w-5 h-5 mr-2" />
              Messages Used
            </span>
            <span className="text-sm font-medium">
              {usage.metrics.totalMessages} / {plan.limits.messagesPerMonth}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                messagePercentage > 90 ? 'bg-red-500' : 
                messagePercentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(messagePercentage, 100)}%` }}
            />
          </div>
          {messagePercentage > 90 && (
            <div className="flex items-center mt-2 text-sm text-red-600">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Approaching message limit
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="flex items-center text-gray-700">
              <Users className="w-5 h-5 mr-2" />
              Active Agents
            </span>
            <span className="text-sm font-medium">
              {usage.metrics.totalAgents} / {
                plan.limits.agentsPerAccount === Infinity 
                  ? '∞' 
                  : plan.limits.agentsPerAccount
              }
            </span>
          </div>
          {plan.limits.agentsPerAccount !== Infinity && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  agentPercentage > 90 ? 'bg-red-500' : 
                  agentPercentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(agentPercentage, 100)}%` }}
              />
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="flex items-center text-gray-700">
              <HardDrive className="w-5 h-5 mr-2" />
              Storage Used
            </span>
            <span className="text-sm font-medium">
              {(usage.metrics.storageUsed / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-blue-500"
              style={{ width: '45%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
