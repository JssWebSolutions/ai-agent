
import { Database } from 'lucide-react';

interface StorageUsageProps {
  used: number;
  total: number;
  icon: React.ReactNode;
}

export function StorageUsage({ used, total, icon }: StorageUsageProps) {
  const percentage = (used / total) * 100;
  const formattedUsed = (used / 1024).toFixed(2);
  const formattedTotal = (total / 1024).toFixed(2);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600">Storage Usage</p>
          <p className="text-2xl font-bold mt-1">
            {formattedUsed} KB / {formattedTotal} KB
          </p>
        </div>
        {icon}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="mt-2 text-sm text-gray-500">
        {percentage.toFixed(1)}% used
      </div>
    </div>
  );
}