import React from 'react';
import { Key } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { APIKeysSection } from './APIKeysSection';

export function APISettings() {
  const { selectedAgent, updateAgent } = useAgentStore();

  if (!selectedAgent) return null;

  const handleModelChange = (field: string, value: any) => {
    updateAgent({
      ...selectedAgent,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Key className="w-6 h-6" />
        API & Model Settings
      </h2>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">LLM Provider</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedAgent.llmProvider}
            onChange={(e) => handleModelChange('llmProvider', e.target.value)}
          >
            <option value="openai">OpenAI (ChatGPT)</option>
            <option value="gemini">Google Gemini</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedAgent.model}
            onChange={(e) => handleModelChange('model', e.target.value)}
          >
            {selectedAgent.llmProvider === 'openai' ? (
              <>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
              </>
            ) : (
              <option value="gemini-pro">Gemini Pro</option>
            )}
          </select>
        </div>

        <APIKeysSection />
      </div>
    </div>
  );
}