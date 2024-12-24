import { useMemo } from 'react';
import { Agent } from '../types/agent';

export interface AnalyticsData {
  totalInteractions: number;
  avgResponseTime: number;
  userSatisfaction: number;
  successRate: number;
  interactionData: { name: string; interactions: number }[];
  responseTimeData: { name: string; responseTime: number }[];
}

export function useAnalytics(agents: Agent[]): AnalyticsData {
  return useMemo(() => {
    const totalInteractions = agents.reduce((sum, agent) => sum + agent.analytics.interactions.length, 0);
    const avgResponseTime = agents.reduce((sum, agent) => {
      const interactions = agent.analytics.interactions;
      return sum + (interactions.length > 0 ? interactions.reduce((s, i) => s + i.responseTime, 0) / interactions.length : 0);
    }, 0) / agents.length || 0;
    const successfulInteractions = agents.reduce((sum, agent) => sum + agent.analytics.interactions.filter(i => i.successful).length, 0);
    const successRate = totalInteractions > 0 ? (successfulInteractions / totalInteractions) * 100 : 0;
    const userSatisfaction = totalInteractions > 0 ? (successRate * 0.7) + ((1 - Math.min(avgResponseTime, 5) / 5) * 30) : 0;

    const interactionData = agents.map(agent => ({ name: agent.name, interactions: agent.analytics.interactions.length }));
    const responseTimeData = agents.map(agent => ({
      name: agent.name,
      responseTime: agent.analytics.interactions.length > 0 ?
        agent.analytics.interactions.reduce((sum, interaction) => sum + interaction.responseTime, 0) / agent.analytics.interactions.length : 0
    }));

    return {
      totalInteractions,
      avgResponseTime,
      userSatisfaction,
      successRate,
      interactionData,
      responseTimeData
    };
  }, [agents]);
}
