/**
 * Coordinator Enums & Type Contracts
 * Documented structure for strict clean architecture boundaries.
 */

export const IntentType = {
  KNOWLEDGE: 'knowledge',
  LEARNING: 'learning',
  TASK: 'task',
  PLANNING: 'planning',
  CREATIVE: 'creative',
  PRODUCTIVITY: 'productivity',
  SKILL_ANALYSIS: 'skill_analysis',
  GENERAL_CONVERSATION: 'general_conversation'
};

export const AgentType = {
  PLANNER: 'PlannerAgent',
  KNOWLEDGE: 'KnowledgeAgent',
  CREATIVE: 'CreativeAgent',
  LEARNING: 'LearningAgent',
  TASK: 'TaskAgent',
  SKILL_ANALYZER: 'SkillAnalyzer',
  PRODUCTIVITY_COACH: 'ProductivityCoach'
};

export const ExecutionStatus = {
  QUEUED: 'queued',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

/**
 * @typedef {Object} AgentTrace
 * @property {string} agentName - The name of the executing sub-agent
 * @property {string} status - Status state (completed, failed, running)
 * @property {string} message - Detail trace summary log
 */

/**
 * @typedef {Object} CoordinatorRequest
 * @property {string} prompt - User text prompt query input
 * @property {string} [sessionId] - Unique conversation session ID
 * @property {string} [workspaceId] - Workspace document ID
 */

/**
 * @typedef {Object} CoordinatorResponse
 * @property {string} content - Output aggregated string response
 * @property {string[]} detectedIntents - Intent categories resolved
 * @property {AgentTrace[]} agentTraces - Agent execution pipeline timelines
 * @property {string} status - Final execution state
 */

/**
 * @typedef {Object} ExecutionPlan
 * @property {string} sessionId - Active session ID
 * @property {string[]} pipeline - Array of AgentType identifiers to run
 * @property {string} currentAgent - Agent currently running
 * @property {string} status - Active state (queued, running)
 */
