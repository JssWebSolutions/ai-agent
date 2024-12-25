import React from 'react';

interface AnalyticsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export function AnalyticsCard({ title, value, icon }: AnalyticsCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}
