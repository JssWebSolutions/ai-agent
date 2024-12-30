import{ useEffect, useState } from 'react';
import { Activity, Users, MessageSquare, Database } from 'lucide-react';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { UsageMetric } from './UsageMetric';
import { AgentStatus } from './AgentStatus';
import { StorageUsage } from './StorageUsage';
import { MessageStats } from './MessageStats';

export function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState({
    totalMessages: 0,
    activeAgents: 0,
    storageUsed: 0,
    storageLimit: 1000000, // 1GB in KB
    messageRate: 0
  });

  const { lastMessage, sendMessage } = useWebSocket('wss://your-websocket-url/analytics');

  useEffect(() => {
    // Request initial data
    sendMessage({ type: 'GET_METRICS' });

    // Set up periodic refresh
    const interval = setInterval(() => {
      sendMessage({ type: 'GET_METRICS' });
    }, 30000);

    return () => clearInterval(interval);
  }, [sendMessage]);

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        if (data.type === 'METRICS_UPDATE') {
          setMetrics(data.metrics);
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

        <StorageUsage
          used={metrics.storageUsed}
          total={metrics.storageLimit}
          icon={<Database className="w-6 h-6 text-purple-500" />}
        />

        <UsageMetric
          title="System Status"
          value="Operational"
          icon={<Activity className="w-6 h-6 text-emerald-500" />}
          status="healthy"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentStatus />
        <MessageStats />
      </div>
    </div>
  );
}