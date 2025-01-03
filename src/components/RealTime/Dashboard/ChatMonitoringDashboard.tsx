import { useState } from 'react';
import { MetricsOverview } from './Metrics/MetricsOverview';
import { AgentStatusPanel } from './AgentStatusPanel';
import { LiveConversations } from './LiveConversations';
import { WidgetInteractions } from './WidgetInteractions';
import { FilterBar } from './FilterBar';
import { useWebSocketData } from '../../../hooks/useWebSocketData';
import { ChatFilter, ChatMetrics } from '../../../types/chat';

export function ChatMonitoringDashboard() {
  const [filter, setFilter] = useState<ChatFilter>({
    agent: 'all',
    status: 'all',
    period: '24h'
  });

  const metrics = useWebSocketData<ChatMetrics>('/analytics', 'METRICS_UPDATE');

  if (!metrics) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chat Monitoring</h1>
        <FilterBar filter={filter} onFilterChange={setFilter} />
      </div>

      <MetricsOverview metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AgentStatusPanel filter={filter} />
        </div>
        <div className="lg:col-span-2">
          <LiveConversations filter={filter} />
        </div>
      </div>

      <WidgetInteractions filter={filter} />
    </div>
  );
}