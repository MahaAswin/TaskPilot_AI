import { AgentType, ExecutionStatus } from '../types/CoordinatorTypes.js';
import IntentAnalyzer from '../utils/IntentAnalyzer.js';
import ExecutionPlanner from '../utils/ExecutionPlanner.js';
import ResponseMerger from '../utils/ResponseMerger.js';
import PromptBuilder from '../prompts/PromptBuilder.js';

// Base Interface/Contract for sub-agents (similar to BaseAgent.js)
class SubAgentInterface {
  constructor(name) {
    this.name = name;
  }
  async execute(prompt, context) {
    throw new Error('Method execute() must be implemented');
  }
  status() {
    return 'idle';
  }
  health() {
    return 'green';
  }
}

import { globalProviderManager } from '../../../providers/ProviderManager.js';

// Real Sub-Agent implementations delegating to Gemini AI ProviderManager
class RealKnowledgeAgent extends SubAgentInterface {
  async execute(prompt, context) {
    const res = await globalProviderManager.executeMethod('generateNotes', prompt, { agent: 'Knowledge Agent' });
    return res.response;
  }
}

class RealPlannerAgent extends SubAgentInterface {
  async execute(prompt, context) {
    const res = await globalProviderManager.executeMethod('generateRoadmap', prompt, { agent: 'Planner Agent' });
    return res.response;
  }
}

class RealTaskAgent extends SubAgentInterface {
  async execute(prompt, context) {
    const res = await globalProviderManager.executeMethod('generateTasks', prompt, { agent: 'Task Agent' });
    return res.response;
  }
}

class RealLearningAgent extends SubAgentInterface {
  async execute(prompt, context) {
    const res = await globalProviderManager.executeMethod('generateQuiz', prompt, { agent: 'Learning Agent' });
    return res.response;
  }
}

class RealCreativeAgent extends SubAgentInterface {
  async execute(prompt, context) {
    const res = await globalProviderManager.executeMethod('generateMermaidDiagram', prompt, { agent: 'Creative Agent' });
    return res.response;
  }
}

class RealSkillAnalyzer extends SubAgentInterface {
  async execute(prompt, context) {
    const res = await globalProviderManager.executeMethod('explainTopic', `Skill Analysis for: ${prompt}`, { agent: 'Skill Analyzer Agent' });
    return res.response;
  }
}

class RealProductivityCoach extends SubAgentInterface {
  async execute(prompt, context) {
    const res = await globalProviderManager.executeMethod('explainTopic', `Productivity Coaching Advice for: ${prompt}`, { agent: 'Productivity Coach Agent' });
    return res.response;
  }
}

export class CoordinatorService {
  constructor() {
    this.registry = new Map();
    this.sessions = new Map(); // Session ID -> Session object
    this.initializeRegistry();
  }

  initializeRegistry() {
    this.registry.set(AgentType.KNOWLEDGE, new RealKnowledgeAgent(AgentType.KNOWLEDGE));
    this.registry.set(AgentType.PLANNER, new RealPlannerAgent(AgentType.PLANNER));
    this.registry.set(AgentType.TASK, new RealTaskAgent(AgentType.TASK));
    this.registry.set(AgentType.LEARNING, new RealLearningAgent(AgentType.LEARNING));
    this.registry.set(AgentType.CREATIVE, new RealCreativeAgent(AgentType.CREATIVE));
    this.registry.set(AgentType.SKILL_ANALYZER, new RealSkillAnalyzer(AgentType.SKILL_ANALYZER));
    this.registry.set(AgentType.PRODUCTIVITY_COACH, new RealProductivityCoach(AgentType.PRODUCTIVITY_COACH));
  }

  /**
   * Run the full Multi-Agent pipeline.
   * @param {string} prompt - User prompt text
   * @param {Object} context - Session and workspace details
   * @returns {Promise<Object>} Final merged response plus logs
   */
  async executePipeline(prompt, context = {}) {
    const sessionId = context.sessionId || `session-${Date.now()}`;
    const startTime = Date.now();

    console.log(`[COORDINATOR LOG] Request received. Session: ${sessionId}, Prompt: "${prompt}"`);

    // 1. Intent Analysis
    const detectedIntents = IntentAnalyzer.analyze(prompt);
    console.log(`[COORDINATOR LOG] Intents detected: ${detectedIntents.join(', ')}`);

    // 2. Execution Planning
    const pipeline = ExecutionPlanner.plan(detectedIntents);
    console.log(`[COORDINATOR LOG] Execution plan: ${pipeline.join(' ➔ ') || 'General Conversation'}`);

    const traces = [];
    const responses = [];

    // Initialize session logs
    this.sessions.set(sessionId, {
      sessionId,
      pipeline,
      currentAgent: null,
      status: ExecutionStatus.QUEUED,
      traces,
      createdAt: new Date()
    });

    try {
      if (pipeline.length === 0) {
        // General conversational response fallback
        traces.push({
          agentName: 'CoordinatorAgent',
          status: ExecutionStatus.COMPLETED,
          message: 'General conversation handled directly by Coordinator.'
        });

        const generalResponse = `### 🛸 Coordinator Gateway Output\n\nI classified your inquiry as a general query.\n- Prompt: *"${prompt}"*\n- Status: Scaffolding active. Let me know if you need to draft study notes, roadmaps, or quizzes!`;
        
        this.sessions.set(sessionId, {
          ...this.sessions.get(sessionId),
          status: ExecutionStatus.COMPLETED,
          traces
        });

        return {
          content: generalResponse,
          detectedIntents,
          agentTraces: traces,
          status: ExecutionStatus.COMPLETED,
          executionTime: Date.now() - startTime
        };
      }

      // 3. Execution Loop
      this.sessions.get(sessionId).status = ExecutionStatus.RUNNING;

      for (const agentType of pipeline) {
        this.sessions.get(sessionId).currentAgent = agentType;
        const agent = this.registry.get(agentType);

        if (!agent) {
          throw new Error(`Sub-agent ${agentType} is not registered in the Registry.`);
        }

        console.log(`[COORDINATOR LOG] Executing sub-agent: ${agentType}`);
        
        // Build prompt with context
        const promptDetails = PromptBuilder.build(prompt, context);

        // Execute agent (wrapped in a try-catch for error resilience)
        try {
          const content = await agent.execute(promptDetails.fullPromptText, context);
          responses.push({ agentName: agentType, content });
          
          traces.push({
            agentName: agentType,
            status: 'completed',
            message: `Completed execution successfully. Exchanged context of ${promptDetails.meta.historyCount} history items.`
          });
        } catch (agentErr) {
          console.error(`[COORDINATOR ERROR] Agent ${agentType} failed:`, agentErr.message);
          traces.push({
            agentName: agentType,
            status: 'failed',
            message: `Failed during execution: ${agentErr.message}`
          });
          // Continue execution loop or throw depending on critical settings. Here we resume to ensure partial response delivery.
        }
      }

      // 4. Response Merging
      const finalMergedContent = ResponseMerger.merge(responses);

      this.sessions.set(sessionId, {
        ...this.sessions.get(sessionId),
        currentAgent: null,
        status: ExecutionStatus.COMPLETED,
        traces
      });

      console.log(`[COORDINATOR LOG] Execution completed in ${Date.now() - startTime}ms`);

      return {
        content: finalMergedContent,
        detectedIntents,
        agentTraces: traces,
        status: ExecutionStatus.COMPLETED,
        executionTime: Date.now() - startTime
      };

    } catch (err) {
      console.error('[COORDINATOR CRITICAL ERROR] Pipeline crashed:', err.message);
      
      this.sessions.set(sessionId, {
        ...this.sessions.get(sessionId),
        status: ExecutionStatus.FAILED,
        currentAgent: null
      });

      return {
        content: `### ❌ Coordinator execution failed\n\nReason: ${err.message}`,
        detectedIntents,
        agentTraces: traces,
        status: ExecutionStatus.FAILED,
        executionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Fetch current session traces.
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId) || null;
  }
}

// Export singleton instance
export const coordinatorService = new CoordinatorService();
export default coordinatorService;
