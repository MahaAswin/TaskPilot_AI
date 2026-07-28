// Multi-Agent Orchestration Layer Mock Dataset

export const AGENTS_LIST = [
  { id: 'agent-coord', name: 'Coordinator Agent', role: 'Central Dispatcher & Intent Resolver', status: 'active', color: 'border-indigo-500 bg-indigo-50 text-indigo-700', icon: 'Cpu' },
  { id: 'agent-plan', name: 'Planner Agent', role: 'Roadmap & Daily Schedule Generator', status: 'idle', color: 'border-blue-500 bg-blue-50 text-blue-700', icon: 'Calendar' },
  { id: 'agent-know', name: 'Knowledge Agent', role: 'Document Indexing & RAG Retrieval', status: 'idle', color: 'border-purple-500 bg-purple-50 text-purple-700', icon: 'GraduationCap' },
  { id: 'agent-learn', name: 'Learning Agent', role: 'Interactive Quizzes & Skill Assessment', status: 'idle', color: 'border-emerald-500 bg-emerald-50 text-emerald-700', icon: 'BookOpen' },
  { id: 'agent-create', name: 'Creative Agent', role: 'Content Generation & Flashcards', status: 'idle', color: 'border-pink-500 bg-pink-50 text-pink-700', icon: 'Palette' },
  { id: 'agent-task', name: 'Task Agent', role: 'Task Queue & Habit Tracker', status: 'idle', color: 'border-amber-500 bg-amber-50 text-amber-700', icon: 'CheckSquare' },
  { id: 'agent-skill', name: 'Skill Analyzer Agent', role: 'Multi-Domain Skill Matrix & Radar', status: 'idle', color: 'border-cyan-500 bg-cyan-50 text-cyan-700', icon: 'Brain' },
  { id: 'agent-coach', name: 'Productivity Coach Agent', role: 'Focus Sessions & Performance Reports', status: 'idle', color: 'border-orange-500 bg-orange-50 text-orange-700', icon: 'Zap' }
];

export const SAMPLE_WORKFLOWS = [
  {
    id: 'wf-1',
    title: 'I want to master Java & Spring Boot',
    intent: 'Learning & Planning',
    workflowType: 'Sequential Multi-Agent',
    status: 'completed',
    duration: '1.4s',
    agentsUsed: ['Coordinator', 'Planner', 'Knowledge', 'Learning', 'Task', 'Skill', 'Productivity Coach'],
    nodes: [
      { id: 'node-1', agentId: 'agent-coord', label: 'Intent Analysis', status: 'completed', step: 1, position: { x: 50, y: 100 } },
      { id: 'node-2', agentId: 'agent-plan', label: 'Generate Roadmap', status: 'completed', step: 2, position: { x: 220, y: 100 } },
      { id: 'node-3', agentId: 'agent-know', label: 'Fetch Java Notes', status: 'completed', step: 3, position: { x: 390, y: 100 } },
      { id: 'node-4', agentId: 'agent-learn', label: 'Build Quiz Sets', status: 'completed', step: 4, position: { x: 560, y: 100 } },
      { id: 'node-5', agentId: 'agent-task', label: 'Schedule Daily Tasks', status: 'completed', step: 5, position: { x: 730, y: 100 } },
      { id: 'node-6', agentId: 'agent-skill', label: 'Update Skill Profile', status: 'completed', step: 6, position: { x: 900, y: 100 } }
    ]
  },
  {
    id: 'wf-2',
    title: 'Generate DSA Arrays & Sliding Window Notes',
    intent: 'Knowledge Generation',
    workflowType: 'Parallel Multi-Agent',
    status: 'completed',
    duration: '0.9s',
    agentsUsed: ['Coordinator', 'Knowledge', 'Creative', 'Learning'],
    nodes: [
      { id: 'node-1', agentId: 'agent-coord', label: 'Intent Analysis', status: 'completed', step: 1, position: { x: 50, y: 100 } },
      { id: 'node-2', agentId: 'agent-know', label: 'Index DSA Topics', status: 'completed', step: 2, position: { x: 250, y: 50 } },
      { id: 'node-3', agentId: 'agent-create', label: 'Generate Cheatsheet', status: 'completed', step: 2, position: { x: 250, y: 150 } },
      { id: 'node-4', agentId: 'agent-learn', label: 'Attach Practice Questions', status: 'completed', step: 3, position: { x: 450, y: 100 } }
    ]
  },
  {
    id: 'wf-3',
    title: 'Create My Placement Preparation Roadmap',
    intent: 'Planning',
    workflowType: 'Full Pipeline',
    status: 'running',
    duration: '0.6s',
    agentsUsed: ['Coordinator', 'Planner', 'Task', 'Knowledge', 'Learning', 'Productivity Coach'],
    nodes: [
      { id: 'node-1', agentId: 'agent-coord', label: 'Intent Analysis', status: 'completed', step: 1, position: { x: 50, y: 100 } },
      { id: 'node-2', agentId: 'agent-plan', label: 'Build Placement Plan', status: 'completed', step: 2, position: { x: 220, y: 100 } },
      { id: 'node-3', agentId: 'agent-task', label: 'Generate Task Queue', status: 'running', step: 3, position: { x: 390, y: 100 } },
      { id: 'node-4', agentId: 'agent-know', label: 'Fetch Core CS Topics', status: 'pending', step: 4, position: { x: 560, y: 100 } }
    ]
  }
];

export const SHARED_CONTEXT = {
  activeIntent: 'Multi-Agent Learning & Task Generation',
  goal: 'Master Java Spring Boot Microservices and DSA Arrays',
  workflowType: 'Sequential Execution',
  selectedAgents: ['Coordinator', 'Planner', 'Knowledge', 'Learning', 'Task', 'Skill', 'Productivity Coach'],
  sharedMemory: {
    userDomain: 'Computer Science / Engineering',
    targetDeadline: '60 Days',
    focusTopic: 'Java Multithreading & DSA Arrays',
    currentRank: 'Master',
    difficultyPreference: 'Intermediate - Advanced'
  },
  executionState: 'PIPELINE_AGREEMENT_REACHED'
};

export const SYSTEM_LOGS = [
  { id: 'log-1', timestamp: '22:15:01', level: 'INFO', agent: 'Coordinator', message: 'User Intent identified: [Learning & Task Management]' },
  { id: 'log-2', timestamp: '22:15:02', level: 'INFO', agent: 'Workflow Engine', message: 'Selected agents sequence: [Planner ➔ Knowledge ➔ Learning ➔ Task ➔ Skill ➔ Coach]' },
  { id: 'log-3', timestamp: '22:15:03', level: 'INFO', agent: 'Planner Agent', message: 'Generated 6-week milestone schedule.' },
  { id: 'log-4', timestamp: '22:15:04', level: 'INFO', agent: 'Knowledge Agent', message: 'Indexed 14 topic modules in shared memory context.' },
  { id: 'log-5', timestamp: '22:15:05', level: 'SUCCESS', agent: 'Response Aggregator', message: 'Unified multi-agent response synthesized successfully (1.4s).' }
];

export const ORCHESTRATOR_STATS = {
  totalExecutions: 142,
  successfulWorkflows: 138,
  failedWorkflows: 4,
  avgDuration: '1.1s',
  mostUsedAgent: 'Planner Agent (88%)',
  mostUsedWorkflow: 'Sequential Multi-Agent'
};

export default {
  AGENTS_LIST,
  SAMPLE_WORKFLOWS,
  SHARED_CONTEXT,
  SYSTEM_LOGS,
  ORCHESTRATOR_STATS
};
