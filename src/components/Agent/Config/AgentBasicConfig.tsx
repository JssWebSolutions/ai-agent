import React from 'react';
import { Agent } from '../../../types/agent';
import { FormField } from '../../Form/FormField';
import { ImageSelector } from '../ImageSelector';
import { LanguageSelector } from '../LanguageSelector';

interface AgentBasicConfigProps {
  agent: Agent;
  onChange: (field: keyof Agent, value: any) => void;
}

export function AgentBasicConfig({ agent, onChange }: AgentBasicConfigProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Agent Image</label>
        <ImageSelector
          value={agent.image || ''}
          onChange={(value) => onChange('image', value)}
        />
      </div>

      <FormField
        label="Agent Name"
        value={agent.name}
        onChange={(value) => onChange('name', value)}
        placeholder="Enter agent name"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700">Language</label>
        <div className="mt-1">
          <LanguageSelector
            value={agent.language}
            onChange={(value) => onChange('language', value)}
          />
        </div>
      </div>
    </div>
  );
}
