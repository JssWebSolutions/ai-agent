import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAgentStore } from '../../store/agentStore';
import { cn } from '../../utils/cn';

interface RecentActivityItem {
  query: string;
  timestamp: Date;
}

export function RecentActivityPanel() {
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const { agents } = useAgentStore();

  useEffect(() => {
    const fetchRecentActivity = () => {
      // Combine interactions from all agents
      const allInteractions = agents.reduce((acc, agent) => [
        ...acc,
        ...(agent.analytics?.interactions || [])
      ], [] as any[]);

      // Sort interactions by timestamp (descending)
      allInteractions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      // Extract queries and timestamps, limit to 10
      const recent = allInteractions.slice(0, 10).map(interaction => ({
        query: interaction.query,
        timestamp: interaction.timestamp
      }));

      setRecentActivity(recent);
    };

    fetchRecentActivity();
  }, [agents]);

  return (
    <div className={cn(
      "bg-white p-4 rounded-lg shadow border border-gray-200",
      "space-y-4"
    )}>
      <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
      {recentActivity.length > 0 ? (
        <ul className="space-y-2">
          {recentActivity.map((item) => (
            <li key={item.timestamp.getTime()} className="flex justify-between">
              <span className="text-gray-700">{item.query}</span>
              <span className="text-gray-500 text-sm">
                {formatDistanceToNow(item.timestamp, { addSuffix: true })}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No recent activity.</p>
      )}
    </div>
  );
}
