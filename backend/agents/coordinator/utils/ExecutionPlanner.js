import { IntentType, AgentType } from '../types/CoordinatorTypes.js';

export class ExecutionPlanner {
  /**
   * Sort hierarchy to execute dependencies first.
   * e.g., Knowledge (data gathering) -> Planning (timelines) -> Task (queuing items) -> Creative (drawings)
   */
  static get executionOrder() {
    return [
      AgentType.KNOWLEDGE,
      AgentType.PLANNER,
      AgentType.TASK,
      AgentType.LEARNING,
      AgentType.CREATIVE,
      AgentType.SKILL_ANALYZER,
      AgentType.PRODUCTIVITY_COACH
    ];
  }

  /**
   * Resolve and compile the sequential execution pipeline.
   * @param {string[]} intents - Detected categories list
   * @returns {string[]} Ordered list of AgentTypes
   */
  static plan(intents) {
    if (!intents || intents.length === 0) return [];

    const selectedAgents = new Set();

    intents.forEach((intent) => {
      switch (intent) {
        case IntentType.KNOWLEDGE:
          selectedAgents.add(AgentType.KNOWLEDGE);
          break;
        case IntentType.PLANNING:
          selectedAgents.add(AgentType.PLANNER);
          break;
        case IntentType.TASK:
          selectedAgents.add(AgentType.TASK);
          break;
        case IntentType.LEARNING:
          selectedAgents.add(AgentType.LEARNING);
          break;
        case IntentType.CREATIVE:
          selectedAgents.add(AgentType.CREATIVE);
          break;
        case IntentType.SKILL_ANALYSIS:
          selectedAgents.add(AgentType.SKILL_ANALYZER);
          break;
        case IntentType.PRODUCTIVITY:
          selectedAgents.add(AgentType.PRODUCTIVITY_COACH);
          break;
        default:
          // General conversations do not trigger specialized sub-agents
          break;
      }
    });

    // Sort agents in standard logical pipeline order
    return this.executionOrder.filter(agent => selectedAgents.has(agent));
  }
}

export default ExecutionPlanner;
