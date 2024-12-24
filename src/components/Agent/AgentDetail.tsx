import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAgentStore } from '../../store/agentStore';
import { AgentTab } from '../Tabs/AgentTab';
import { SettingsTab } from '../Tabs/SettingsTab';
import { TrainingTab } from '../Tabs/TrainingTab';
import { AnalyticsTab } from '../Tabs/AnalyticsTab';
import { WidgetConfigurator } from '../Widget/WidgetConfigurator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { cn } from '../../utils/cn';
import { AgentsList } from '../Agents/AgentsList'; // Import AgentsList

export function AgentDetail() {
  const { agentId } = useParams();
  const { agents, selectAgent, loadAgents } = useAgentStore();
  const [selectedAgent, setSelectedAgent] = useState<typeof agents[number] | null>(null);
  const [activeTab, setActiveTab] = useState('agent');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchAgents = async () => {
      try {
        await loadAgents(agents[0]?.userId || ''); // Fetch agents for the first user
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgents();
  }, [loadAgents, agents]);

  useEffect(() => {
    if (agentId && agents) {
      const agent = agents.find(agent => agent.id === agentId);
      setSelectedAgent(agent);
      selectAgent(agentId);
    }
  }, [agentId, agents, selectAgent]);

  if (isLoading) return <div>Loading...</div>;
  if (!selectedAgent) return <div>Agent not found</div>;

  return (
    <div className="flex gap-8 mt-4">
      <AgentsList />
      <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
        <Tabs defaultValue="agent" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex gap-2 p-1 mb-6">
            <TabsTrigger value="agent" className={cn("tab-trigger", activeTab === 'agent' ? 'data-[state=active]' : '')}>
              <Settings className="w-4 h-4" />
              Agent
            </TabsTrigger>
            <TabsTrigger value="settings" className={cn("tab-trigger", activeTab === 'settings' ? 'data-[state=active]' : '')}>
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="training" className={cn("tab-trigger", activeTab === 'training' ? 'data-[state=active]' : '')}>
              <BookOpen className="w-4 h-4" />
              Training
            </TabsTrigger>
            <TabsTrigger value="analytics" className={cn("tab-trigger", activeTab === 'analytics' ? 'data-[state=active]' : '')}>
              <BarChart2 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="widget" className={cn("tab-trigger", activeTab === 'widget' ? 'data-[state=active]' : '')}>
              <Code className="w-4 h-4" />
              Widget
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agent">
            <AgentTab />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
          <TabsContent value="training">
            <TrainingTab />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsTab />
          </TabsContent>
          <TabsContent value="widget">
            <WidgetConfigurator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
