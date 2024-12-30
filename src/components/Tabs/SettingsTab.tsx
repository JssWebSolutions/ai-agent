import{ useState } from 'react';
import { useAgentStore } from '../../store/agentStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Volume2, MessageSquare, Key } from 'lucide-react';
import { VoiceSettings } from '../Settings/VoiceSettings';
import { ResponseSettings } from '../Settings/ResponseSettings';
import { APISettings } from '../Settings/APISettings';

export function SettingsTab() {
  const { selectedAgent } = useAgentStore();
  const [activeTab, setActiveTab] = useState('voice');

  if (!selectedAgent) {
    return (
      <div className="p-6 text-center text-gray-500">
        Please select or create an agent first
      </div>
    );
  }

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex gap-2 p-1 mb-6">
          <TabsTrigger value="voice" className="tab-trigger">
            <Volume2 className="w-4 h-4" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="response" className="tab-trigger">
            <MessageSquare className="w-4 h-4" />
            Response
          </TabsTrigger>
          <TabsTrigger value="api" className="tab-trigger">
            <Key className="w-4 h-4" />
            API & Model
          </TabsTrigger>
        </TabsList>

        <TabsContent value="voice">
          <VoiceSettings />
        </TabsContent>

        <TabsContent value="response">
          <ResponseSettings />
        </TabsContent>

        <TabsContent value="api">
          <APISettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
