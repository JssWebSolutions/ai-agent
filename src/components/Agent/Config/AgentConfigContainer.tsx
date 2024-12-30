
import { Settings } from 'lucide-react';
import { Agent } from '../../../types/agent';
import { AgentBasicConfig } from './AgentBasicConfig';
import { AgentPromptConfig } from './AgentPromptConfig';
import { FloatingSaveButton } from '../../SaveButton/FloatingSaveButton';
import { useFormChanges } from '../../../hooks/useFormChanges';

interface AgentConfigContainerProps {
  agent: Agent;
  onSave: (agent: Agent) => Promise<void>;
}

export function AgentConfigContainer({ agent, onSave }: AgentConfigContainerProps) {
  const { currentData, hasChanges, updateField, resetChanges } = useFormChanges(agent);

  const handleSave = async () => {
    if (!currentData) return;
    await onSave(currentData);
    resetChanges();
  };

  if (!currentData) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Agent Configuration</h2>
      </div>

      <div className="space-y-8">
        <AgentBasicConfig
          agent={currentData}
          onChange={updateField}
        />

        <AgentPromptConfig
          agent={currentData}
          onChange={updateField}
        />
      </div>

      <FloatingSaveButton
        onSave={handleSave}
        hasChanges={hasChanges}
      />
    </div>
  );
}
