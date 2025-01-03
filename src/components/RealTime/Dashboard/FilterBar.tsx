import { Filter } from 'lucide-react';

interface FilterBarProps {
  filter: {
    agent: string;
    status: string;
    period: string;
  };
  onFilterChange: (filter: any) => void;
}

export function FilterBar({ filter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-500">Filter by:</span>
      </div>

      <select
        value={filter.agent}
        onChange={(e) => onFilterChange({ ...filter, agent: e.target.value })}
        className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Agents</option>
        <option value="online">Online Agents</option>
        <option value="offline">Offline Agents</option>
      </select>

      <select
        value={filter.status}
        onChange={(e) => onFilterChange({ ...filter, status: e.target.value })}
        className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="pending">Pending</option>
        <option value="closed">Closed</option>
      </select>

      <select
        value={filter.period}
        onChange={(e) => onFilterChange({ ...filter, period: e.target.value })}
        className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="1h">Last Hour</option>
        <option value="24h">Last 24 Hours</option>
        <option value="7d">Last 7 Days</option>
        <option value="30d">Last 30 Days</option>
      </select>
    </div>
  );
}