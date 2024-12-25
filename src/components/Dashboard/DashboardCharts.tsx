import React from 'react';
import { Agent } from '../../types/agent';
import { BarChart } from '../Charts/BarChart';
import { LineChart } from '../Charts/LineChart';
import { calculateChartData } from '../../utils/analytics';

interface DashboardChartsProps {
  agents: Agent[];
}

export function DashboardCharts({ agents }: DashboardChartsProps) {
  const { interactionData, responseTimeData } = calculateChartData(agents);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BarChart data={interactionData} title="Agent Interactions" />
      <LineChart data={responseTimeData} title="Average Response Time" />
    </div>
  );
}
