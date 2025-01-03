import { useEffect, useState } from 'react';
import { Activity, Users, MessageSquare, Database } from 'lucide-react';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { UsageMetric } from './UsageMetric';
import { AgentStatus } from './AgentStatus';
import { StorageUsage } from './StorageUsage';
import { MessageStats } from './MessageStats';
import { useAgentStore } from '../../../store/agentStore';
import { calculateMetrics, calculateChartData } from '../../../utils/analytics';

export function AnalyticsDashboard() {
  const { agents } = useAgentStore();
  const [metrics, setMetrics] = useState({
    totalMessages: 0,
    activeAgents: 0,
    storageUsed: 0,
    messageRate: 0,
    userSatisfaction: 0,
    successRate: 0
  });

  const { lastMessage, sendMessage } = useWebSocket('/analytics');

  useEffect(() => {
    // Calculate metrics from actual agent data
    const calculatedMetrics = calculateMetrics(agents);
    const { interactionData } = calculateChartData(agents);

    setMetrics({
      totalMessages: calculatedMetrics.totalInteractions,
      activeAgents: agents.length,
      storageUsed: 0, // This would come from your storage service
      messageRate: interactionData[interactionData.length - 1]?.interactions || 0,
      userSatisfaction: calculatedMetrics.userSatisfaction,
      successRate: calculatedMetrics.successRate
    });

    // Request real-time updates
    sendMessage({ type: 'SUBSCRIBE_METRICS' });

    return () => {
      sendMessage({ type: 'UNSUBSCRIBE_METRICS' });
    };
  }, [agents, sendMessage]);

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        if (data.type === 'METRICS_UPDATE') {
          setMetrics(prevMetrics => ({
            ...prevMetrics,
            ...data.metrics
          }));
        }
      } catch (error) {
        console.error('Error parsing metrics:', error);
      }
    }
  }, [lastMessage]);

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Real-Time Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <UsageMetric
          title="Total Messages"
          value={metrics.totalMessages.toLocaleString()}
          icon={<MessageSquare className="w-6 h-6 text-blue-500" />}
          trend={metrics.messageRate > 0 ? 'up' : 'down'}
          trendValue={`${metrics.messageRate}/min`}
        />

        <UsageMetric
          title="Active Agents"
          value={metrics.activeAgents.toString()}
          icon={<Users className="w-6 h-6 text-green-500" />}
          status={metrics.activeAgents > 0 ? 'online' : 'offline'}
        />

        <UsageMetric
          title="Success Rate"
          value={`${Math.round(metrics.successRate)}%`}
          icon={<Activity className="w-6 h-6 text-emerald-500" />}
          trend={metrics.successRate >= 90 ? 'up' : 'down'}
          status={metrics.successRate >= 90 ? 'healthy' : 'warning'}
        />

        <StorageUsage
          used={metrics.storageUsed}
          total={1000000} // 1GB in KB
          icon={<Database className="w-6 h-6 text-purple-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentStatus agents={agents} />
        <MessageStats agents={agents} />
      </div>
    </div>
  );
}