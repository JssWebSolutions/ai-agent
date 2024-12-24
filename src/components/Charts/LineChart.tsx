import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface LineChartProps {
  data: { name: string; responseTime: number }[];
  title: string;
}

export function LineChart({ data, title }: LineChartProps) {
  return (
    <div className="dashboard-card">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <RechartsLineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="responseTime" stroke="#3B82F6" />
      </RechartsLineChart>
    </div>
  );
}
