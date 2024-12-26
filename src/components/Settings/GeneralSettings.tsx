import React from 'react';
import { Settings2 } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { FormField } from '../Form/FormField';
import { LanguageSelector } from '../Agent/LanguageSelector';
import { ImageSelector } from '../Agent/ImageSelector';

export function GeneralSettings() {
  const { selectedAgent, updateAgent } = useAgentStore();

  if (!selectedAgent) return null;

  const handleChange = (field: string, value: any) => {
    updateAgent({
      ...selectedAgent,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Settings2 className="w-6 h-6" />
        General Settings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Agent Image</label>
          <ImageSelector
            value={selectedAgent.image || ''}
            onChange={(value) => handleChange('image', value)}
          />
        </div>

        <FormField
          label="Agent Name"
          value={selectedAgent.name}
          onChange={(value) => handleChange('name', value)}
          placeholder="Enter agent name"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">Language</label>
          <LanguageSelector
            value={selectedAgent.language}
            onChange={(value) => handleChange('language', value)}
          />
        </div>

        <div className="md:col-span-2">
          <FormField
            label="First Message"
            value={selectedAgent.firstMessage}
            onChange={(value) => handleChange('firstMessage', value)}
            type="textarea"
            placeholder="Enter the initial greeting message"
          />
        </div>

        <div className="md:col-span-2">
          <FormField
            label="System Prompt"
            value={selectedAgent.systemPrompt}
            onChange={(value) => handleChange('systemPrompt', value)}
            type="textarea"
            rows={5}
            placeholder="Define how the AI agent should behave"
          />
        </div>
      </div>
    </div>
  );
}
