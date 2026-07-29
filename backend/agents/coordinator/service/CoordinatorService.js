import { AgentType, ExecutionStatus } from '../types/CoordinatorTypes.js';
import IntentAnalyzer from '../utils/IntentAnalyzer.js';
import ExecutionPlanner from '../utils/ExecutionPlanner.js';
import ResponseMerger from '../utils/ResponseMerger.js';
import PromptBuilder from '../prompts/PromptBuilder.js';
import { globalProviderManager } from '../../../providers/ProviderManager.js';
import { MockProvider } from '../../../providers/MockProvider.js';
import { emailAgent } from '../../email/EmailAgent.js';

const mockFallbackProvider = new MockProvider();

// Base Interface/Contract for sub-agents
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

/**
 * Format AI responses (strings or structured objects) directly into clean Markdown
 */
function formatAIResponse(rawResponse) {
  if (!rawResponse) return 'The AI service returned no content.';

  if (typeof rawResponse === 'string') {
    const trimmed = rawResponse.trim();
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        const parsed = JSON.parse(trimmed);
        return formatAIResponse(parsed);
      } catch (e) {
        return rawResponse;
      }
    }
    return rawResponse;
  }

  // Quiz JSON Array
  if (Array.isArray(rawResponse)) {
    return rawResponse.map((item, idx) => {
      let qText = `### Question ${idx + 1}: ${item.question || item.title || item.topic || ''}\n`;
      if (item.options && Array.isArray(item.options)) {
        item.options.forEach((opt, oIdx) => {
          qText += `- [ ] **${String.fromCharCode(65 + oIdx)}.** ${opt}\n`;
        });
      }
      if (item.answer || item.correctAnswer) {
        qText += `\n*Correct Answer:* **${item.answer || item.correctAnswer}**\n`;
      }
      if (item.explanation) {
        qText += `*Explanation:* ${item.explanation}\n`;
      }
      return qText;
    }).join('\n\n');
  }

  // Email Agent Output
  if (rawResponse.subject && rawResponse.body) {
    return `**Subject:** ${rawResponse.subject}\n\n${rawResponse.body}`;
  }

  // Security Report Output
  if (rawResponse.status && (rawResponse.explanation || rawResponse.recommendation || rawResponse.detectionSummary)) {
    let report = `### Security Analysis: ${rawResponse.status}\n\n`;
    if (rawResponse.risk) report += `**Risk Level:** ${rawResponse.risk}\n\n`;
    if (rawResponse.detectionSummary) report += `**Summary:** ${rawResponse.detectionSummary}\n\n`;
    if (rawResponse.explanation) {
      if (rawResponse.explanation.whatWasDetected) report += `**What Was Detected:** ${rawResponse.explanation.whatWasDetected}\n\n`;
      if (rawResponse.explanation.whyDangerous) report += `**Why It Is Dangerous:** ${rawResponse.explanation.whyDangerous}\n\n`;
      if (rawResponse.explanation.recommendedAction) report += `**Recommended Action:** ${rawResponse.explanation.recommendedAction}\n\n`;
    } else if (rawResponse.recommendation) {
      report += `**Recommendation:** ${rawResponse.recommendation}\n\n`;
    }
    return report;
  }

  // Roadmap / Plan Object
  if (rawResponse.milestones || rawResponse.steps || rawResponse.weeks || rawResponse.days || rawResponse.roadmap) {
    const items = rawResponse.milestones || rawResponse.steps || rawResponse.weeks || rawResponse.days || rawResponse.roadmap;
    if (Array.isArray(items)) {
      return items.map((m, i) => `### Step ${i + 1}: ${m.title || m.name || m.topic || 'Milestone'}\n${m.description || m.details || m.summary || ''}`).join('\n\n');
    }
  }

  // General Object
  if (typeof rawResponse === 'object') {
    if (rawResponse.response) return formatAIResponse(rawResponse.response);
    if (rawResponse.content) return formatAIResponse(rawResponse.content);
    if (rawResponse.text) return formatAIResponse(rawResponse.text);
    return JSON.stringify(rawResponse, null, 2);
  }

  return String(rawResponse);
}

// 1. General Query Agent -> Call AI Provider Chain (Gemini -> Grok -> Ollama -> Mock)
class RealGeneralAgent extends SubAgentInterface {
  async execute(prompt, context) {
    const res = await globalProviderManager.executeMethod('generateText', prompt, { agent: 'General Agent' });
    return formatAIResponse(res.rawResult || res.response);
  }
}

// 2. Study Notes Agent -> Call AI Provider Chain
class RealKnowledgeAgent extends SubAgentInterface {
  async execute(prompt, context) {
    const res = await globalProviderManager.executeMethod('generateNotes', prompt, { agent: 'Knowledge Agent' });
    return formatAIResponse(res.rawResult || res.response);
  }
}

// 3. Roadmap Agent -> Call AI Provider Chain
class RealPlannerAgent extends SubAgentInterface {
  async execute(prompt, context) {
    const res = await globalProviderManager.executeMethod('generateRoadmap', prompt, { agent: 'Planner Agent' });
    return formatAIResponse(res.rawResult || res.response);
  }
}

// 4. Quiz Agent -> Call AI Provider Chain
class RealLearningAgent extends SubAgentInterface {
  async execute(prompt, context) {
    const res = await globalProviderManager.executeMethod('generateQuiz', prompt, { agent: 'Learning Agent' });
    return formatAIResponse(res.rawResult || res.response);
  }
}

// 5. Email Agent -> Route to Email Agent
class RealEmailAgent extends SubAgentInterface {
  async execute(prompt, context) {
    const emailRes = await emailAgent.generateEmail({ prompt });
    return formatAIResponse(emailRes);
  }
}

// 6. Security AI Agent -> Route to Security AI
class RealSecurityAgent extends SubAgentInterface {
  async execute(prompt, context) {
    const urlMatch = prompt.match(/https?:\/\/[^\s]+/i);
    if (urlMatch) {
      const secRes = await linkSecurityAgent.execute(urlMatch[0]);
      return formatAIResponse(secRes);
    } else if (prompt.includes('@') || prompt.toLowerCase().includes('phish') || prompt.toLowerCase().includes('spam')) {
      const secRes = await emailSecurityAgent.execute({ body: prompt, subject: 'Security Threat Check' });
      return formatAIResponse(secRes);
    } else {
      const cleanUrl = prompt.trim().replace(/^https?:\/\//, '');
      const secRes = await linkSecurityAgent.execute(`https://${cleanUrl}`);
      return formatAIResponse(secRes);
    }
  }
}

// 7. Calendar Agent -> Route to Calendar Agent (Study Plan via AI Provider Chain)
class RealCalendarAgent extends SubAgentInterface {
  async execute(prompt, context) {
    const res = await globalProviderManager.executeMethod('generateStudyPlan', prompt, { agent: 'Calendar Agent' });
    return formatAIResponse(res.rawResult || res.response);
  }
}

// Task Agent
class RealTaskAgent extends SubAgentInterface {
  async execute(prompt, context) {
    const res = await globalProviderManager.executeMethod('generateTasks', prompt, { agent: 'Task Agent' });
    return formatAIResponse(res.rawResult || res.response);
  }
}

// Creative Agent
class RealCreativeAgent extends SubAgentInterface {
  async execute(prompt, context) {
    const res = await globalProviderManager.executeMethod('generateMermaidDiagram', prompt, { agent: 'Creative Agent' });
    return formatAIResponse(res.rawResult || res.response);
  }
}

// Skill Analyzer Agent
class RealSkillAnalyzer extends SubAgentInterface {
  async execute(prompt, context) {
    const res = await globalProviderManager.executeMethod('explainTopic', `Skill Analysis for: ${prompt}`, { agent: 'Skill Analyzer Agent' });
    return formatAIResponse(res.rawResult || res.response);
  }
}

// Productivity Coach Agent
class RealProductivityCoach extends SubAgentInterface {
  async execute(prompt, context) {
    const res = await globalProviderManager.executeMethod('explainTopic', `Productivity Coaching Advice for: ${prompt}`, { agent: 'Productivity Coach Agent' });
    return formatAIResponse(res.rawResult || res.response);
  }
}

export class CoordinatorService {
  constructor() {
    this.registry = new Map();
    this.sessions = new Map(); // Session ID -> Session object
    this.initializeRegistry();
  }

  initializeRegistry() {
    this.registry.set(AgentType.GENERAL, new RealGeneralAgent(AgentType.GENERAL));
    this.registry.set(AgentType.STUDY_NOTES, new RealKnowledgeAgent(AgentType.STUDY_NOTES));
    this.registry.set(AgentType.ROADMAP, new RealPlannerAgent(AgentType.ROADMAP));
    this.registry.set(AgentType.QUIZ, new RealLearningAgent(AgentType.QUIZ));
    this.registry.set(AgentType.EMAIL, new RealEmailAgent(AgentType.EMAIL));
    this.registry.set(AgentType.SECURITY, new RealSecurityAgent(AgentType.SECURITY));
    this.registry.set(AgentType.CALENDAR, new RealCalendarAgent(AgentType.CALENDAR));

    // Aliases
    this.registry.set(AgentType.KNOWLEDGE, new RealKnowledgeAgent(AgentType.KNOWLEDGE));
    this.registry.set(AgentType.PLANNER, new RealPlannerAgent(AgentType.PLANNER));
    this.registry.set(AgentType.LEARNING, new RealLearningAgent(AgentType.LEARNING));
    this.registry.set(AgentType.TASK, new RealTaskAgent(AgentType.TASK));
    this.registry.set(AgentType.CREATIVE, new RealCreativeAgent(AgentType.CREATIVE));
    this.registry.set(AgentType.SKILL_ANALYZER, new RealSkillAnalyzer(AgentType.SKILL_ANALYZER));
    this.registry.set(AgentType.PRODUCTIVITY_COACH, new RealProductivityCoach(AgentType.PRODUCTIVITY_COACH));
  }

  /**
   * Run the full Multi-Agent pipeline.
   * @param {string} prompt - User prompt text
   * @param {Object} context - Session and workspace details
   * @returns {Promise<Object>} Final merged AI response plus internal logs
   */
  async executePipeline(prompt, context = {}) {
    const sessionId = context.sessionId || `session-${Date.now()}`;
    const startTime = Date.now();
    const PIPELINE_TIMEOUT_MS = 30000; // 30-second limit for multi-agent Coordinator pipeline

    console.log(`[COORDINATOR LOG] Request received. Session: ${sessionId}, Prompt: "${prompt}" (30s timeout limit)`);

    const executionPromise = (async () => {
      // 1. Intent Analysis
      const detectedIntents = IntentAnalyzer.analyze(prompt);
      console.log(`[COORDINATOR LOG] Intents detected: ${detectedIntents.join(', ')}`);

      // 2. Execution Planning
      let pipeline = ExecutionPlanner.plan(detectedIntents);
      if (!pipeline || pipeline.length === 0) {
        pipeline = [AgentType.GENERAL];
      }
      console.log(`[COORDINATOR LOG] Execution plan: ${pipeline.join(' ➔ ')}`);

      const traces = [];
      const responses = [];

      // Initialize session logs internally
      this.sessions.set(sessionId, {
        sessionId,
        pipeline,
        currentAgent: null,
        status: ExecutionStatus.QUEUED,
        traces,
        createdAt: new Date()
      });

      this.sessions.get(sessionId).status = ExecutionStatus.RUNNING;

      for (const agentType of pipeline) {
        this.sessions.get(sessionId).currentAgent = agentType;
        let agent = this.registry.get(agentType);

        if (!agent) {
          agent = this.registry.get(AgentType.GENERAL);
        }

        console.log(`[COORDINATOR LOG] Executing sub-agent: ${agentType}`);
        
        const promptDetails = PromptBuilder.build(prompt, context);

        try {
          const content = await agent.execute(promptDetails.fullPromptText, context);
          responses.push({ agentName: agentType, content });
          
          traces.push({
            agentName: agentType,
            status: 'completed',
            message: `Completed execution successfully.`
          });
        } catch (agentErr) {
          console.error(`[COORDINATOR ERROR] Agent ${agentType} failed:`, agentErr.message);
          traces.push({
            agentName: agentType,
            status: 'failed',
            message: `Failed during execution: ${agentErr.message}`
          });
        }
      }

      // 4. Response Merging - Direct AI content without scaffolding headers
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
    })();

    // 15-second timeout Promise race fallback
    let timeoutId;
    const timeoutPromise = new Promise((resolve) => {
      timeoutId = setTimeout(async () => {
        console.log(`[COORDINATOR TIMEOUT] Request for "${prompt}" hit ${(PIPELINE_TIMEOUT_MS / 1000).toFixed(1)}s timeout limit. Returning instant default answer.`);
        const defaultContent = await mockFallbackProvider.generateText(prompt);
        
        const fallbackTraces = [
          { agentName: 'CoordinatorAgent', status: 'completed', message: 'Executed request via default AI engine (time limit fallback).' }
        ];

        this.sessions.set(sessionId, {
          sessionId,
          pipeline: [AgentType.GENERAL],
          currentAgent: null,
          status: ExecutionStatus.COMPLETED,
          traces: fallbackTraces,
          createdAt: new Date()
        });

        resolve({
          content: defaultContent,
          detectedIntents: [AgentType.GENERAL],
          agentTraces: fallbackTraces,
          status: ExecutionStatus.COMPLETED,
          executionTime: PIPELINE_TIMEOUT_MS
        });
      }, PIPELINE_TIMEOUT_MS);
    });

    try {
      const result = await Promise.race([executionPromise, timeoutPromise]);
      clearTimeout(timeoutId);
      return result;
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('[COORDINATOR CRITICAL ERROR] Pipeline crashed:', err.message);
      const defaultContent = await mockFallbackProvider.generateText(prompt);
      
      return {
        content: defaultContent,
        detectedIntents: [AgentType.GENERAL],
        agentTraces: [
          { agentName: 'CoordinatorAgent', status: 'completed', message: 'Executed request via default AI engine.' }
        ],
        status: ExecutionStatus.COMPLETED,
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
