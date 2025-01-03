import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Agent } from '../../../types/agent';
import { calculateChartData } from '../../../utils/analytics';

interface MessageStatsProps {
  agents: Agent[];
}

export function MessageStats({ agents }: MessageStatsProps) {
  const { interactionData } = calculateChartData(agents);

  if (interactionData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center">
        <p className="text-gray-500">No message data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Message Statistics</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={interactionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="interactions" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}