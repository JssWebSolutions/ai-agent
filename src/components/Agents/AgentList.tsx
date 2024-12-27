import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Agent } from '../../types/agent';
import { Bot, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAgentStore } from '../../store/agentStore';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext'; // Import Toast context


interface AgentListProps {
  agents?: Agent[];
}

export function AgentList({ agents: propAgents }: AgentListProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { agents: storeAgents, loadAgents, deleteAgent } = useAgentStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);

  // Use either provided agents or agents from store
  const agents = propAgents || storeAgents;

  useEffect(() => {
    const fetchAgents = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        await loadAgents(user.id);
      } catch (error) {
        console.error('Error loading agents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!propAgents) {
      fetchAgents();
    } else {
      setIsLoading(false);
    }
  }, [user?.id, loadAgents, propAgents]);

  const handleAgentClick = (agentId: string) => {
    navigate(`/agent/${agentId}`);
  };

  const handleDelete = async (e: React.MouseEvent, agentId: string) => {
    e.stopPropagation(); // Prevent navigation to agent details
    const confirmDelete = window.confirm('Are you sure you want to delete this agent?');
    if (!confirmDelete) return;

    try {
      await deleteAgent(agentId);
      toast({
        title: 'Success',
        description: 'Agent deleted successfully',
        type: 'success'
      });
      // Redirect to home or agent list after deletion
      navigate('/agent');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete agent',
        type: 'error'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!agents || agents.length === 0) {
    return (
      <div className="text-center py-8">
        <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No agents found.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
        >
          Create your first agent
        </button>
      </div>
    );
  }

  return (

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {agents.map((agent) => (
        <div
          key={agent.id}
          onClick={() => handleAgentClick(agent.id)}
          className={cn(
            "bg-white rounded-lg shadow p-6 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all duration-200",
            "group"
          )}
        >
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
            {agent.image ? (
              <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
            ) : (
              <Bot className="w-6 h-6 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
            <p className="text-sm text-gray-500">
              {agent.llmProvider} - {agent.language}
            </p>
          </div>

          {/* Delete button */}
          <button
            onClick={(e) => handleDelete(e, agent.id)}
            className="opacity-0 group-hover:opacity-100 hover:text-red-600 p-1 transition-opacity items-right"
            aria-label="Delete agent"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>



  );
}
