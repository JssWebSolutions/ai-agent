import { useState, useEffect } from 'react';
import { useAgentStore } from '../../store/agentStore';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../Button';
import { useNavigate } from 'react-router-dom';
import { DashboardMetrics } from './DashboardMetrics';
import { DashboardCharts } from './DashboardCharts';
import { RecentActivityPanel } from './RecentActivityPanel';
import { AgentList } from '../Agents/AgentList';
import { useToast } from '../../contexts/ToastContext';

export function UserDashboard() {
  const { agents, createNewAgent, loadAgents } = useAgentStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch agents on mount or when user ID changes
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        if (user?.id) {
          await loadAgents(user.id);
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
        toast({
          title: 'Error',
          description: 'Failed to load agents. Please try again.',
          type: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgents();
  }, [user?.id, loadAgents, toast]);

  // Create new agent handler
  const handleCreateAgent = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    
    try {
      if (!user.subscription?.planId) {
        throw new Error('No subscription plan found');
      }

      const newAgent = await createNewAgent(user.id);
      navigate(`/agent/${newAgent.id}`);
    } catch (error: any) {
      console.error('Error creating agent:', error);
      const errorMessage = error.message || 'Failed to create agent. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome message and actions */}
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">
          Welcome, {user?.name || 'Guest'}!
        </div>
        <div className="flex gap-4">
          {user && <Button onClick={() => navigate('/agent')}>All Agents</Button>}
          {user?.emailVerified && (
            <Button onClick={handleCreateAgent}>Create New Agent</Button>
          )}
        </div>
      </div>

      {/* Dashboard metrics */}
      <DashboardMetrics agents={agents} />

      {/* Dashboard charts */}
      <DashboardCharts agents={agents} />

      {/* Recent activity panel */}
      <RecentActivityPanel />
      
      {/* Agent List */}
      <AgentList agents={agents} />
    </div>
  );
}