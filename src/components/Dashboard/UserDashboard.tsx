import React, { useState, useEffect } from 'react';
import { Bot, Users, Activity, Clock } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../Button';
import { useNavigate } from 'react-router-dom';
import { DashboardMetrics } from './DashboardMetrics';
import { DashboardCharts } from './DashboardCharts';
import { AgentList } from '../Agents/AgentList';

export function UserDashboard() {
  const { agents, createNewAgent, loadAgents } = useAgentStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

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

	const handleCreateAgent = async () => {
	  if (!user?.id) return;
	  setIsLoading(true); // Optional: Show a loading state
	  try {
		await createNewAgent(user.id);
		console.log('Agent created successfully!');
	  } catch (error) {
		console.error('Error creating agent:', error);
	  } finally {
		setIsLoading(false);
	  }
	};


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome message and buttons */}
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">
          Welcome, {user?.name || 'Guest'}!
        </div>
        <div className="flex gap-4">
          {user && (
            <Button onClick={() => navigate('/agent')}>All Agents</Button>
          )}
          {user?.emailVerified && (
            <Button onClick={handleCreateAgent}>Create New Agent</Button>
          )}
        </div>
      </div>

      {/* Metrics */}
      <DashboardMetrics agents={agents} />

      {/* Charts */}
      <DashboardCharts agents={agents} />

      {/* Agent List */}
      <AgentList agents={agents} />
    </div>
  );
}
