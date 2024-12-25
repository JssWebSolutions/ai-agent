import { Agent } from '../types/agent';

export function calculateMetrics(agents: Agent[]) {
  const totalInteractions = agents.reduce((sum, agent) => 
    sum + (agent.analytics?.interactions?.length || 0), 0);

  let avgResponseTime = 0;
  let successfulInteractions = 0;

  agents.forEach(agent => {
    if (agent.analytics?.interactions) {
      agent.analytics.interactions.forEach(interaction => {
        avgResponseTime += interaction.responseTime;
        if (interaction.successful) {
          successfulInteractions++;
        }
      });
    }
  });

  avgResponseTime = totalInteractions > 0 ? avgResponseTime / totalInteractions : 0;
  const successRate = totalInteractions > 0 ? (successfulInteractions / totalInteractions) * 100 : 0;
  const userSatisfaction = totalInteractions > 0 
    ? (successRate * 0.7) + ((1 - Math.min(avgResponseTime, 5) / 5) * 30) 
    : 0;

  return {
    totalInteractions,
    avgResponseTime,
    userSatisfaction,
    successRate
  };
}

export function calculateChartData(agents: Agent[]) {
  // Group interactions by day
  const dailyInteractions: Record<string, number> = {};
  const dailyResponseTimes: Record<string, { total: number; count: number }> = {};

  agents.forEach(agent => {
    agent.analytics?.interactions?.forEach(interaction => {
      const date = new Date(interaction.timestamp).toLocaleDateString();
      
      // Interactions count
      dailyInteractions[date] = (dailyInteractions[date] || 0) + 1;

      // Response times
      if (!dailyResponseTimes[date]) {
        dailyResponseTimes[date] = { total: 0, count: 0 };
      }
      dailyResponseTimes[date].total += interaction.responseTime;
      dailyResponseTimes[date].count += 1;
    });
  });

  // Convert to chart data format
  const interactionData = Object.entries(dailyInteractions)
    .map(([name, interactions]) => ({ name, interactions }))
    .slice(-7); // Last 7 days

  const responseTimeData = Object.entries(dailyResponseTimes)
    .map(([name, data]) => ({
      name,
      responseTime: data.total / data.count
    }))
    .slice(-7); // Last 7 days

  return {
    interactionData,
    responseTimeData
  };
}
