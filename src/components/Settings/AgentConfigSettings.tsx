import React from 'react';
import { Settings2 } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { FormField } from '../Form/FormField';

export function AgentConfigSettings() {
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
        Agent Configuration
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Agent Name"
          value={selectedAgent.name}
          onChange={(value) => handleChange('name', value)}
          placeholder="Enter agent name"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">Language</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedAgent.language}
            onChange={(e) => handleChange('language', e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
          </select>
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Response Style</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedAgent.responseStyle}
            onChange={(e) => handleChange('responseStyle', e.target.value)}
          >
            <option value="concise">Concise</option>
            <option value="detailed">Detailed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Interaction Mode</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedAgent.interactionMode}
            onChange={(e) => handleChange('interactionMode', e.target.value)}
          >
            <option value="informative">Informative</option>
            <option value="conversational">Conversational</option>
            <option value="support">Support</option>
            <option value="interactive">Interactive</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Behavior Rules</label>
          <div className="space-y-2">
            {selectedAgent.behaviorRules.map((rule, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={rule}
                  onChange={(e) => {
                    const newRules = [...selectedAgent.behaviorRules];
                    newRules[index] = e.target.value;
                    handleChange('behaviorRules', newRules);
                  }}
                  className="flex-1 input-field"
                  placeholder="Enter behavior rule"
                />
                <button
                  onClick={() => {
                    const newRules = selectedAgent.behaviorRules.filter((_, i) => i !== index);
                    handleChange('behaviorRules', newRules);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => handleChange('behaviorRules', [...selectedAgent.behaviorRules, ''])}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add Rule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}