import { ChatFilter, Agent, Conversation, Interaction } from '../types/chat';

export function filterAgents(agents: Agent[], filter: ChatFilter): Agent[] {
  return agents.filter(agent => {
    if (filter.status !== 'all' && agent.status !== filter.status) return false;
    return true;
  });
}

export function filterConversations(conversations: Conversation[], filter: ChatFilter): Conversation[] {
  return conversations.filter(conv => {
    if (filter.agent !== 'all' && conv.agentId !== filter.agent) return false;
    if (filter.status !== 'all' && conv.status !== filter.status) return false;
    return true;
  });
}

export function filterInteractions(interactions: Interaction[], filter: ChatFilter): Interaction[] {
  return interactions.filter(interaction => {
    if (filter.agent !== 'all' && interaction.agentId !== filter.agent) return false;
    return true;
  });
}