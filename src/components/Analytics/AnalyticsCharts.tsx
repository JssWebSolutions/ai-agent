
import { BarChart2 } from 'lucide-react';
import { BarChart } from '../Charts/BarChart';
import { LineChart } from '../Charts/LineChart';

interface AnalyticsChartsProps {
  interactionData: { name: string; interactions: number }[];
  responseTimeData: { name: string; responseTime: number }[];
}

export function AnalyticsCharts({ interactionData, responseTimeData }: AnalyticsChartsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
        <BarChart2 className="w-6 h-6" />
        Analytics Overview
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BarChart data={interactionData} title="Daily Interactions" />
        <LineChart data={responseTimeData} title="Response Time Trend" />
      </div>
    </div>
  );
}
