
import { cn } from '../../../utils/cn';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface UsageMetricProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
  status?: 'online' | 'offline' | 'healthy' | 'warning' | 'error';
}

export function UsageMetric({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  status 
}: UsageMetricProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        {status && (
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            status === 'online' && "bg-green-100 text-green-800",
            status === 'offline' && "bg-gray-100 text-gray-800",
            status === 'healthy' && "bg-emerald-100 text-emerald-800",
            status === 'warning' && "bg-yellow-100 text-yellow-800",
            status === 'error' && "bg-red-100 text-red-800"
          )}>
            {status}
          </span>
        )}
      </div>

      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold mt-2">{value}</p>

      {trend && (
        <div className="flex items-center gap-2 mt-4">
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={cn(
            "text-sm font-medium",
            trend === 'up' ? "text-green-600" : "text-red-600"
          )}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
}