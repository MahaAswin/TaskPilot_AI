import { IntentType, AgentType } from '../types/CoordinatorTypes.js';

export class ExecutionPlanner {
  /**
   * Sort hierarchy to execute dependencies first.
   * e.g., Knowledge (data gathering) -> Planning (timelines) -> Task (queuing items) -> Creative (drawings)
   */
  static get executionOrder() {
    return [
      AgentType.GENERAL,
      AgentType.STUDY_NOTES,
      AgentType.ROADMAP,
      AgentType.QUIZ,
      AgentType.EMAIL,
      AgentType.SECURITY,
      AgentType.CALENDAR,
      AgentType.TASK,
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
    if (!intents || intents.length === 0) return [AgentType.GENERAL];

    const selectedAgents = new Set();

    intents.forEach((intent) => {
      switch (intent) {
        case IntentType.GENERAL_QUERY:
        case IntentType.GENERAL_CONVERSATION:
          selectedAgents.add(AgentType.GENERAL);
          break;
        case IntentType.STUDY_NOTES:
        case IntentType.KNOWLEDGE:
          selectedAgents.add(AgentType.STUDY_NOTES);
          break;
        case IntentType.ROADMAP:
        case IntentType.PLANNING:
          selectedAgents.add(AgentType.ROADMAP);
          break;
        case IntentType.QUIZ:
        case IntentType.LEARNING:
          selectedAgents.add(AgentType.QUIZ);
          break;
        case IntentType.EMAIL:
          selectedAgents.add(AgentType.EMAIL);
          break;
        case IntentType.SECURITY:
          selectedAgents.add(AgentType.SECURITY);
          break;
        case IntentType.CALENDAR:
          selectedAgents.add(AgentType.CALENDAR);
          break;
        case IntentType.TASK:
          selectedAgents.add(AgentType.TASK);
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
          selectedAgents.add(AgentType.GENERAL);
          break;
      }
    });

    if (selectedAgents.size === 0) {
      selectedAgents.add(AgentType.GENERAL);
    }

    // Sort agents in standard logical pipeline order
    return this.executionOrder.filter(agent => selectedAgents.has(agent));
  }
}

export default ExecutionPlanner;
