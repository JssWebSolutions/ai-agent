
import { Rocket } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { APIKeysSection } from './APIKeysSection';

export function APISettings() {
  const { selectedAgent } = useAgentStore();

  if (!selectedAgent) return null;

  return (
    <div className="space-y-6">
      <h5 className="font-bold flex items-center gap-2">
        <Rocket className="w-6 h-6" />
        More Setting Comming Soon
      </h5>

      <div className="grid grid-cols-1 gap-6">
        <APIKeysSection />
      </div>
    </div>
  );
}
