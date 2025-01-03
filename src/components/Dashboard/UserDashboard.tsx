import{ useState, useEffect } from 'react';
import { useAgentStore } from '../../store/agentStore';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../Button';
import { useNavigate } from 'react-router-dom';
import { DashboardMetrics } from './DashboardMetrics';
import { DashboardCharts } from './DashboardCharts';
import { RecentActivityPanel } from './RecentActivityPanel';
import { AgentList } from '../Agents/AgentList';


export function UserDashboard() {
  const { agents, createNewAgent, loadAgents } = useAgentStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch agents on mount or when user ID changes
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        if (user?.id) {
          await loadAgents(user.id);
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgents();
  }, [user?.id, loadAgents]);

  // Create new agent handler
  const handleCreateAgent = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const newAgent = await createNewAgent(user.id); // Get the newly created agent
      navigate(`/agent/${newAgent.id}`);  // Redirect to the new agent's page
    } catch (error) {
      console.error('Error creating agent:', error);
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

  // Render UserDashboard
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
