import React from 'react';
import { Key } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { APIKeysSection } from './APIKeysSection';

export function APISettings() {
  const { selectedAgent } = useAgentStore();

  if (!selectedAgent) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Key className="w-6 h-6" />
        API Keys
      </h2>

      <div className="grid grid-cols-1 gap-6">
        <APIKeysSection />
      </div>
    </div>
  );
}
