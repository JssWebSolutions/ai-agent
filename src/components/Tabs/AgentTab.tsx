import React from 'react';
import { useAgentStore } from '../../store/agentStore';
import { AgentConfigContainer } from '../Agent/Config/AgentConfigContainer';

export function AgentTab() {
  const { selectedAgent, updateAgent } = useAgentStore();

  if (!selectedAgent) return null;

  return (
    <div className="p-6">
      <AgentConfigContainer
        agent={selectedAgent}
        onSave={updateAgent}
      />
    </div>
  );
}
