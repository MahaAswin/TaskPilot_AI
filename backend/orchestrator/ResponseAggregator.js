// Orchestration Core: Response Aggregator (Synthesizes Multi-Agent Outputs)

export class ResponseAggregator {
  static aggregate(results = [], goal = '') {
    return {
      goal,
      totalAgentsExecuted: results.length,
      unifiedResponse: `Orchestrated multi-agent pipeline completed across ${results.length} agents for goal: "${goal}"`,
      steps: results
    };
  }
}

export default ResponseAggregator;
