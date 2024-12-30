import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function MessageStats() {
  const data = [
    { name: 'Mon', messages: 120 },
    { name: 'Tue', messages: 150 },
    { name: 'Wed', messages: 180 },
    { name: 'Thu', messages: 140 },
    { name: 'Fri', messages: 160 },
    { name: 'Sat', messages: 90 },
    { name: 'Sun', messages: 85 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Message Statistics</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="messages" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}