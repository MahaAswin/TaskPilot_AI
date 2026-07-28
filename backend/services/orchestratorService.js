// Multi-Agent Orchestrator Service Layer

import { IntentAnalyzer } from '../orchestrator/IntentAnalyzer.js';
import { WorkflowEngine } from '../orchestrator/WorkflowEngine.js';
import { ExecutionManager } from '../orchestrator/ExecutionManager.js';
import { ResponseAggregator } from '../orchestrator/ResponseAggregator.js';

export const orchestratorService = {
  runPipeline: async (goal) => {
    const intentData = IntentAnalyzer.analyze(goal);
    const graph = WorkflowEngine.buildGraph(intentData.agents, intentData.intent);
    const results = await ExecutionManager.runPipeline(intentData.agents, { goal });
    const aggregated = ResponseAggregator.aggregate(results, goal);

    return {
      goal,
      intent: intentData.intent,
      workflowType: intentData.workflowType,
      nodes: graph.nodes,
      edges: graph.edges,
      results: aggregated,
      duration: '1.2s'
    };
  },

  getWorkflowsData: async () => {
    return [
      { id: 'wf-1', title: 'I want to master Java', intent: 'Learning & Planning', status: 'completed', duration: '1.4s' },
      { id: 'wf-2', title: 'Generate DSA Notes', intent: 'Knowledge Generation', status: 'completed', duration: '0.9s' }
    ];
  },

  getHistoryData: async () => {
    return [
      { id: 'h-1', goal: 'I want to master Java', agentsUsed: ['Planner', 'Knowledge', 'Learning', 'Task', 'Skill', 'Coach'], duration: '1.4s', status: 'Completed' }
    ];
  },

  getContextData: async () => {
    return {
      activeIntent: 'Multi-Agent Learning & Task Generation',
      goal: 'Master Java Spring Boot Microservices and DSA Arrays',
      sharedMemory: { userDomain: 'Computer Science', currentRank: 'Master' }
    };
  },

  getLogsData: async () => {
    return [
      { id: 'log-1', timestamp: '22:15:01', level: 'INFO', agent: 'Coordinator', message: 'User Intent identified: [Learning & Task Management]' },
      { id: 'log-2', timestamp: '22:15:05', level: 'SUCCESS', agent: 'Response Aggregator', message: 'Unified multi-agent response synthesized successfully (1.4s).' }
    ];
  },

  replayWorkflowCycle: async (workflowId) => {
    return { success: true, message: `Workflow ${workflowId} re-executed cleanly.` };
  }
};

export default orchestratorService;
