
import { BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

interface BarChartProps {
  data: { name: string; interactions: number }[];
  title: string;
}

export function BarChart({ data, title }: BarChartProps) {
  return (
    <div className="dashboard-card">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <RechartsBarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="interactions" fill="#3B82F6" />
      </RechartsBarChart>
    </div>
  );
}
