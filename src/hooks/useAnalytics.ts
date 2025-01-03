import { useMemo } from 'react';
import { Agent } from '../types/agent';

export interface AnalyticsData {
  totalInteractions: number;
  avgResponseTime: number;
  userSatisfaction: number;
  successRate: number;
  interactionData: { name: string; interactions: number }[];
  responseTimeData: { name: string; responseTime: number }[];
  recentInteractions: Array<{
    conversationId: string;
    id: string;
    query: string;
    response: string;
    timestamp: Date;
    responseTime: number;
    successful: boolean;
  }>;
}

export function useAnalytics(agent: Agent | null): AnalyticsData {
  return useMemo(() => {
    if (!agent) {
      return {
        totalInteractions: 0,
        avgResponseTime: 0,
        userSatisfaction: 0,
        successRate: 0,
        interactionData: [],
        responseTimeData: [],
        recentInteractions: []
      };
    }

    const interactions = agent.analytics.interactions || [];
    const totalInteractions = interactions.length;

    const avgResponseTime =
      totalInteractions > 0
        ? interactions.reduce((sum, i) => sum + (i.responseTime || 0), 0) / totalInteractions
        : 0;

    const successfulInteractions = interactions.filter((i) => i.successful).length;
    const successRate =
      totalInteractions > 0 ? (successfulInteractions / totalInteractions) * 100 : 0;

    const userSatisfaction =
      totalInteractions > 0
        ? successRate * 0.7 + (1 - Math.min(avgResponseTime, 5) / 5) * 30
        : 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentInteractions = interactions
      .filter((i) => i.timestamp && new Date(i.timestamp) > thirtyDaysAgo)
      .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime())
      .slice(0, 10);

    const dailyInteractions = interactions.reduce((acc, interaction) => {
      if (interaction.timestamp) {
        const date = new Date(interaction.timestamp).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const dailyResponseTimes = interactions.reduce((acc, interaction) => {
      if (interaction.timestamp) {
        const date = new Date(interaction.timestamp).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = { total: 0, count: 0 };
        }
        acc[date].total += interaction.responseTime || 0;
        acc[date].count += 1;
      }
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const interactionData = Object.entries(dailyInteractions)
      .map(([name, interactions]) => ({ name, interactions }))
      .slice(-7);

    const responseTimeData = Object.entries(dailyResponseTimes)
      .map(([name, data]) => ({
        name,
        responseTime: data.total / data.count
      }))
      .slice(-7);

    return {
      totalInteractions,
      avgResponseTime,
      userSatisfaction,
      successRate,
      interactionData,
      responseTimeData,
      recentInteractions
    };
  }, [agent]);
}
