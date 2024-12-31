
import { Clock, Users, TrendingUp, MessageCircle } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsCard } from '../Analytics/AnalyticsCard';
import { InteractionsList } from '../Analytics/InteractionsList';
import { AnalyticsCharts } from '../Analytics/AnalyticsCharts';

export function AnalyticsTab() {
  const { selectedAgent } = useAgentStore();
  const analytics = useAnalytics(selectedAgent);

  if (!selectedAgent) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Total Interactions"
          value={analytics.totalInteractions.toLocaleString()}
          icon={<MessageCircle className="w-8 h-8 text-blue-500" />}
        />

        <AnalyticsCard
          title="Avg Response Time"
          value={`${analytics.avgResponseTime.toFixed(1)}s`}
          icon={<Clock className="w-8 h-8 text-green-500" />}
        />

        <AnalyticsCard
          title="User Satisfaction"
          value={`${Math.round(analytics.userSatisfaction)}%`}
          icon={<Users className="w-8 h-8 text-purple-500" />}
        />

        <AnalyticsCard
          title="Success Rate"
          value={`${Math.round(analytics.successRate)}%`}
          icon={<TrendingUp className="w-8 h-8 text-yellow-500" />}
        />
      </div>

      <AnalyticsCharts
        interactionData={analytics.interactionData}
        responseTimeData={analytics.responseTimeData}
      />

      <InteractionsList interactions={analytics.recentInteractions} />
    </div>
  );
}
