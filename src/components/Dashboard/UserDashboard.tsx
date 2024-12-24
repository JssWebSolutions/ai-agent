import React, { useState, useEffect } from 'react';
import { Bot, Users, Activity, Clock } from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../Button';
import { useNavigate } from 'react-router-dom';
import { BarChart } from '../Charts/BarChart';
import { LineChart } from '../Charts/LineChart';
import { useAnalytics } from '../../hooks/useAnalytics';
import { cn } from '../../utils/cn';
import { AgentList } from '../Agents/AgentList'; // Import AgentList

export function UserDashboard() {
  const { agents, createNewAgent, loadAgents } = useAgentStore();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const analyticsData = useAnalytics(agents);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        if (user) {
          await loadAgents(user.id);
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgents();
  }, [user, loadAgents]);

  const handleCreateAgent = async () => {
    if (!user) return;
    await createNewAgent(user.id);
  };

  if (authLoading || isLoading) { 
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
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

      {/* Metrics section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={cn("dashboard-card", "group")}> {/* Total Agents */}
          <div className="flex items-center justify-between">
            <div>
              <p className="dashboard-label">Total Agents</p>
              <p className="dashboard-stat">{agents.length}</p>
            </div>
            <div className="dashboard-icon bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Bot className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className={cn("dashboard-card", "group")}> {/* Total Interactions */}
          <div className="flex items-center justify-between">
            <div>
              <p className="dashboard-label">Total Interactions</p>
              <p className="dashboard-stat">{analyticsData.totalInteractions}</p>
            </div>
            <div className="dashboard-icon bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
              <Users className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className={cn("dashboard-card", "group")}> {/* Average Response Time */}
          <div className="flex items-center justify-between">
            <div>
              <p className="dashboard-label">Avg. Response Time</p>
              <p className="dashboard-stat">{analyticsData.avgResponseTime.toFixed(1)}s</p>
            </div>
            <div className="dashboard-icon bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
              <Clock className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>

        <div className={cn("dashboard-card", "group")}> {/* User Satisfaction */}
          <div className="flex items-center justify-between">
            <div>
              <p className="dashboard-label">User Satisfaction</p>
              <p className="dashboard-stat">{Math.round(analyticsData.userSatisfaction)}%</p>
            </div>
            <div className="dashboard-icon bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-colors">
              <Activity className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BarChart data={analyticsData.interactionData} title="Agent Interactions" />
        <LineChart data={analyticsData.responseTimeData} title="Average Response Time" />
      </div>

      {/* Agent List */}
      <AgentList agents={agents} />
    </div>
  );
}
