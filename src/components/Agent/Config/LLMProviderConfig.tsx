import { Bot } from 'lucide-react';
import { Agent } from '../../../types/agent';

interface LLMProviderConfigProps {
  agent: Agent;
  onChange: (field: keyof Agent, value: any) => void;
}

export function LLMProviderConfig({ agent, onChange }: LLMProviderConfigProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold">LLM Provider Settings</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Provider</label>
          <select
            value={agent.llmProvider}
            onChange={(e) => onChange('llmProvider', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="openai">OpenAI (ChatGPT)</option>
            <option value="gemini">Google Gemini</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <select
            value={agent.model}
            onChange={(e) => onChange('model', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {agent.llmProvider === 'openai' ? (
              <>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
              </>
            ) : (
              <option value="gemini-pro">Gemini Pro</option>
            )}
          </select>
        </div>
      </div>
    </div>
  );
}