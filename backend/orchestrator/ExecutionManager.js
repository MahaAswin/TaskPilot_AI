// Orchestration Core: Execution Manager (Pipeline Execution & Error Fallbacks)

import { AgentRouter } from './AgentRouter.js';

export class ExecutionManager {
  static async runPipeline(agents = [], context = {}) {
    const results = [];
    for (const agent of agents) {
      const output = await AgentRouter.route(agent, context);
      results.push(output);
    }
    return results;
  }
}

export default ExecutionManager;
