
import { Agent } from '../../../types/agent';
import { FormField } from '../../Form/FormField';

interface AgentPromptConfigProps {
  agent: Agent;
  onChange: (field: keyof Agent, value: any) => void;
}

export function AgentPromptConfig({ agent, onChange }: AgentPromptConfigProps) {
  return (
    <div className="space-y-6">
      <FormField
        label="First Message"
        value={agent.firstMessage}
        onChange={(value) => onChange('firstMessage', value)}
        type="textarea"
        placeholder="Enter the initial greeting message"
      />

      <FormField
        label="System Prompt"
        value={agent.systemPrompt}
        onChange={(value) => onChange('systemPrompt', value)}
        type="textarea"
        rows={5}
        placeholder="Define how the AI agent should behave"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Behavior Rules</label>
        <div className="space-y-2">
          {agent.behaviorRules.map((rule, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={rule}
                onChange={(e) => {
                  const newRules = [...agent.behaviorRules];
                  newRules[index] = e.target.value;
                  onChange('behaviorRules', newRules);
                }}
                className="flex-1 input-field"
                placeholder="Enter behavior rule"
              />
              <button
                onClick={() => {
                  const newRules = agent.behaviorRules.filter((_, i) => i !== index);
                  onChange('behaviorRules', newRules);
                }}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange('behaviorRules', [...agent.behaviorRules, ''])}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            + Add Rule
          </button>
        </div>
      </div>
    </div>
  );
}
