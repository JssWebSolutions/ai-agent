// Update the metrics display in DashboardMetrics.tsx
import { useEffect, useState } from 'react';
import { Bot, Users, Activity, Clock } from 'lucide-react';
import { Agent } from '../../types/agent';
import { cn } from '../../utils/cn';
import { calculateMetrics } from '../../utils/analytics';
import { getUsageStats } from '../../services/subscription/usage';
import { useAuth } from '../../contexts/AuthContext';
import { PLANS } from '../../services/subscription/plans';

interface DashboardMetricsProps {
  agents: Agent[];
}

export function DashboardMetrics({ agents }: DashboardMetricsProps) {
  const { user } = useAuth();
  const [usageStats, setUsageStats] = useState<any>(null);
  const metrics = calculateMetrics(agents);

  useEffect(() => {
    const loadUsage = async () => {
      if (user?.id) {
        try {
          const stats = await getUsageStats(user.id);
          setUsageStats(stats);
        } catch (error) {
          console.error("Error getting usage stats:", error);
          setUsageStats(null);
        }
      }
    };
    loadUsage();
  }, [user?.id]);

  const planId = user?.subscription?.planId || 'plan_free';
  const plan = Object.values(PLANS).find(p => p.id === planId);
  const messageLimit = plan?.limits.messagesPerMonth || 0;
  const agentLimit = plan?.limits.agentsPerAccount || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className={cn("dashboard-card", "group")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="dashboard-label">Messages Used</p>
            <p className="dashboard-stat">
              {usageStats?.metrics.totalMessages || 0} / {messageLimit === Infinity ? '∞' : messageLimit}
            </p>
          </div>
          <div className="dashboard-icon bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
            <Bot className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>

      <div className={cn("dashboard-card", "group")}>
        <div className="flex items-center justify-between">
          <div>
            <p className="dashboard-label">Active Agents</p>
            <p className="dashboard-stat">
              {agents.length} / {agentLimit === Infinity ? '∞' : agentLimit}
            </p>
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
            <p className="dashboard-label">Success Rate</p>
            <p className="dashboard-stat">{Math.round(metrics.successRate)}%</p>
          </div>
          <div className="dashboard-icon bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-colors">
            <Activity className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      </div>
    </div>
  );
}