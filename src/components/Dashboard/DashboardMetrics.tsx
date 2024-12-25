import React from 'react';
import { Bot, Users, Activity, Clock } from 'lucide-react';
import { Agent } from '../../types/agent';
import { cn } from '../../utils/cn';
import { calculateMetrics } from '../../utils/analytics';

interface DashboardMetricsProps {
  agents: Agent[];
}

export function DashboardMetrics({ agents }: DashboardMetricsProps) {
  const metrics = calculateMetrics(agents);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className={cn("dashboard-card", "group")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="dashboard-label">Total Agents</p>
            <p className="dashboard-stat">{agents.length}</p>
          </div>
          <div className="dashboard-icon bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
            <Bot className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>

      <div className={cn("dashboard-card", "group")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="dashboard-label">Total Interactions</p>
            <p className="dashboard-stat">{metrics.totalInteractions}</p>
          </div>
          <div className="dashboard-icon bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
            <Users className="w-6 h-6 text-green-500" />
          </div>
        </div>
      </div>

      <div className={cn("dashboard-card", "group")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="dashboard-label">Avg. Response Time</p>
            <p className="dashboard-stat">{metrics.avgResponseTime.toFixed(1)}s</p>
          </div>
          <div className="dashboard-icon bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
            <Clock className="w-6 h-6 text-purple-500" />
          </div>
        </div>
      </div>

      <div className={cn("dashboard-card", "group")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="dashboard-label">User Satisfaction</p>
            <p className="dashboard-stat">{Math.round(metrics.userSatisfaction)}%</p>
          </div>
          <div className="dashboard-icon bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-colors">
            <Activity className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
