// Multi-Agent Orchestration Types

export const INTENT_TYPES = {
  LEARNING: 'Learning',
  PLANNING: 'Planning',
  TASK_MANAGEMENT: 'Task Management',
  KNOWLEDGE_GENERATION: 'Knowledge Generation',
  CREATIVE_CONTENT: 'Creative Content',
  SKILL_ANALYSIS: 'Skill Analysis',
  PRODUCTIVITY: 'Productivity',
  MIXED: 'Mixed Intent',
  UNKNOWN: 'Unknown Intent'
};

export const WORKFLOW_PATTERNS = {
  SINGLE_AGENT: 'Single Agent Workflow',
  MULTI_AGENT: 'Multi Agent Workflow',
  SEQUENTIAL: 'Sequential Workflow',
  PARALLEL: 'Parallel Workflow',
  CONDITIONAL: 'Conditional Workflow',
  FALLBACK: 'Fallback Workflow'
};

export default {
  INTENT_TYPES,
  WORKFLOW_PATTERNS
};
