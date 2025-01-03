import { Users, MessageSquare, Clock, Activity } from 'lucide-react';
import { MetricsCard } from './MetricsCard';
import { ChatMetrics } from '../../../../types/chat';

interface MetricsOverviewProps {
  metrics: ChatMetrics;
}

export function MetricsOverview({ metrics }: MetricsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricsCard
        title="Active Chats"
        value={metrics.activeChats}
        icon={MessageSquare}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-500"
      />
      <MetricsCard
        title="Total Messages"
        value={metrics.totalMessages}
        icon={Users}
        iconBgColor="bg-green-50"
        iconColor="text-green-500"
      />
      <MetricsCard
        title="Avg Response Time"
        value={`${metrics.avgResponseTime}s`}
        icon={Clock}
        iconBgColor="bg-yellow-50"
        iconColor="text-yellow-500"
      />
      <MetricsCard
        title="Queue Length"
        value={metrics.queueLength}
        icon={Activity}
        iconBgColor="bg-purple-50"
        iconColor="text-purple-500"
      />
    </div>
  );
}