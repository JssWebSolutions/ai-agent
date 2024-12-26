import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAgentStore } from '../../store/agentStore';
import { AgentTab } from '../Tabs/AgentTab';
import { SettingsTab } from '../Tabs/SettingsTab';
import { TrainingTab } from '../Tabs/TrainingTab';
import { AnalyticsTab } from '../Tabs/AnalyticsTab';
import { WidgetConfigurator } from '../Widget/WidgetConfigurator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { cn } from '../../utils/cn';
import { AgentsList } from '../Agents/AgentsList';
import { Settings, BookOpen, BarChart2, Code, Bot } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function AgentDetail() {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { agents, selectedAgent, selectAgent, loadAgents } = useAgentStore();
  const [activeTab, setActiveTab] = useState('agent');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      if (!user?.id) {
        navigate('/auth');
        return;
      }
      
      setIsLoading(true);
      try {
        await loadAgents(user.id);
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgents();
  }, [user?.id, loadAgents, navigate]);

  useEffect(() => {
    if (agentId && agents.length > 0) {
      const agent = agents.find(a => a.id === agentId);
      if (agent) {
        selectAgent(agentId);
      } else {
        navigate('/agent');
      }
    }
  }, [agentId, agents, selectAgent, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!selectedAgent) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No agent selected.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-8 mt-4">
      <AgentsList />
      <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex gap-2 p-1 mb-6">
            <TabsTrigger value="agent" className={cn("tab-trigger", activeTab === 'agent' ? 'data-[state=active]' : '')}>
              <Bot className="w-4 h-4" />
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
