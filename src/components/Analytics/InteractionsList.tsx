import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Interaction {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
  responseTime: number;
  successful: boolean;
}

interface InteractionsListProps {
  interactions: Interaction[];
}

export function InteractionsList({ interactions }: InteractionsListProps) {
  if (interactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No interactions recorded yet. Start chatting with your agent to see analytics.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {interactions.map((interaction) => (
        <div key={interaction.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">User Query</p>
              <p className="text-gray-600">{interaction.query}</p>
            </div>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(interaction.timestamp, { addSuffix: true })}
            </span>
          </div>
          <div className="mt-2">
            <p className="font-medium">Agent Response</p>
            <p className="text-gray-600">{interaction.response}</p>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span>Response Time: {interaction.responseTime.toFixed(1)}s</span>
              <span className={`px-2 py-1 rounded ${
                interaction.successful ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {interaction.successful ? 'Successful' : 'Failed'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
