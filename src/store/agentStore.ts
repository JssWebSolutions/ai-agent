import { create } from 'zustand';
import { Agent, Interaction } from '../types/agent';
import defaultAgent from '../components/Agent/DefaultAgent';
import * as FirestoreService from '../services/firestore/agents';

interface AgentStore {
  agents: Agent[];
  selectedAgent: Agent | null;
  isLoading: boolean;
  error: string | null;
  loadAgents: (userId: string) => Promise<void>;
  addAgent: (agent: Omit<Agent, 'id'>) => Promise<void>;
  updateAgent: (agent: Agent) => Promise<void>;
  selectAgent: (agentId: string) => void;
  createNewAgent: (userId: string) => Promise<Agent>; // Updated return type
  deleteAgent: (agentId: string) => Promise<void>;
  addTrainingExample: (agentId: string, example: { input: string; output: string; category: string }) => Promise<void>;
  removeTrainingExample: (agentId: string, index: number) => Promise<void>;
  addInteraction: (agentId: string, interaction: { query: string; response: string; responseTime: number; successful: boolean }) => Promise<void>;
}


export const useAgentStore = create<AgentStore>((set, get) => ({
  agents: [],
  selectedAgent: null,
  isLoading: false,
  error: null,

  loadAgents: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const agents = await FirestoreService.getUserAgents(userId);
      set({ 
        agents, 
        selectedAgent: agents[0] || null,
        error: null 
      });
    } catch (error: any) {
      console.error('Error loading agents:', error);
      set({ 
        error: error.message || 'Failed to load agents',
        agents: [],
        selectedAgent: null
      });
    } finally {
      set({ isLoading: false });
    }
  },

  selectAgent: (agentId: string) => {
    const agent = get().agents.find(a => a.id === agentId);
    if (agent) {
      set({ selectedAgent: agent });
    }
  },

  addAgent: async (agent) => {
    set({ isLoading: true, error: null });
    try {
      const id = await FirestoreService.createAgent(agent);
      const newAgent = { ...agent, id };
      set(state => ({
        agents: [...state.agents, newAgent],
        selectedAgent: newAgent,
        error: null
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to add agent' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateAgent: async (agent) => {
    set({ isLoading: true, error: null });
    try {
      await FirestoreService.updateAgent(agent);
      set(state => ({
        agents: state.agents.map(a => a.id === agent.id ? agent : a),
        selectedAgent: state.selectedAgent?.id === agent.id ? agent : state.selectedAgent,
        error: null
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to update agent' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  createNewAgent: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const agentData = { ...defaultAgent, userId };
      const id = await FirestoreService.createAgent(agentData); // Create agent and get the ID
      const newAgent = { ...agentData, id }; // Add the ID to the agent data
      set(state => ({
        agents: [...state.agents, newAgent], // Add new agent to the list
        selectedAgent: newAgent, // Set the new agent as the selected one
        error: null,
      }));
      return newAgent; // Return the created agent
    } catch (error: any) {
      set({ error: error.message || 'Failed to create new agent' });
      throw error; // Re-throw the error to handle it in the caller
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAgent: async (agentId) => {
    set({ isLoading: true, error: null });
    try {
      await FirestoreService.deleteAgent(agentId);
      set(state => {
        const newAgents = state.agents.filter(a => a.id !== agentId);
        return {
          agents: newAgents,
          selectedAgent: state.selectedAgent?.id === agentId ? newAgents[0] || null : state.selectedAgent,
          error: null
        };
      });
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete agent' });
    } finally {
      set({ isLoading: false });
    }
  },

  addTrainingExample: async (agentId, example) => {
    const agent = get().agents.find(a => a.id === agentId);
    if (!agent) return;

    const updatedAgent = {
      ...agent,
      trainingExamples: [...agent.trainingExamples, example]
    };

    await get().updateAgent(updatedAgent);
  },

  removeTrainingExample: async (agentId, index) => {
    const agent = get().agents.find(a => a.id === agentId);
    if (!agent) return;

    const updatedAgent = {
      ...agent,
      trainingExamples: agent.trainingExamples.filter((_, i) => i !== index)
    };

    await get().updateAgent(updatedAgent);
  },

  addInteraction: async (agentId: string, interaction: Interaction) => {
    set({ isLoading: true, error: null });
    try {
      await FirestoreService.addInteraction(agentId, interaction);
  
      set((state) => {
        const updatedAgents = state.agents.map((agent) =>
          agent.id === agentId
            ? {
                ...agent,
                analytics: {
                  ...agent.analytics,
                  interactions: [
                    {
                      id: `interaction-${Date.now()}`,
                      conversationId: interaction.conversationId || "default-conversation-id",
                      ...interaction,
                      timestamp: new Date(),
                    },
                    ...(agent.analytics.interactions || []),
                  ],
                },
              }
            : agent
        );
  
        return {
          agents: updatedAgents,
          selectedAgent:
            state.selectedAgent?.id === agentId
              ? updatedAgents.find((a) => a.id === agentId)
              : state.selectedAgent,
        };
      });
    } catch (error: any) {
      set({ error: error.message || "Failed to add interaction" });
    } finally {
      set({ isLoading: false });
    }
  }    
  


}));
