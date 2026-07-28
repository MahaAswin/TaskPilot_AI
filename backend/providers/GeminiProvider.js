import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseProvider } from './BaseProvider.js';
import { PromptBuilder } from './PromptBuilder.js';

export class GeminiProvider extends BaseProvider {
  constructor(config = {}) {
    super({ name: 'Gemini', model: config.model || 'gemini-1.5-pro', ...config });
    
    this.apiKey = config.apiKey || process.env.GEMINI_API_KEY || '';
    if (this.apiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
      } catch (err) {
        console.warn('[GeminiProvider] Initialization error:', err.message);
      }
    }
  }

  /**
   * Helper to execute raw text generation with Gemini SDK
   */
  async _callGemini(promptText, modelName = null) {
    if (!this.apiKey || !this.genAI) {
      console.warn('[GeminiProvider] GEMINI_API_KEY not configured or invalid. Using fallback payload.');
      return null;
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: modelName || this.model || 'gemini-1.5-pro' });
      const result = await model.generateContent(promptText);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('[GeminiProvider SDK Error]:', error?.message || error);
      throw error;
    }
  }

  /**
   * Safe helper to parse JSON outputs from LLM responses
   */
  _parseJSON(text, fallbackObj) {
    if (!text) return fallbackObj;
    try {
      // Clean possible ```json codeblocks
      const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn('[GeminiProvider] Failed to parse JSON response, returning fallback:', e.message);
      return fallbackObj;
    }
  }

  /**
   * Safe helper to clean Mermaid diagram outputs
   */
  _cleanMermaid(text, fallbackMermaid) {
    if (!text) return fallbackMermaid;
    let cleaned = text.replace(/```mermaid/gi, '').replace(/```/g, '').trim();
    if (!cleaned.startsWith('graph')) {
      cleaned = `graph TD;\n  A[${cleaned.slice(0, 40)}] --> B[Completed];`;
    }
    return cleaned;
  }

  // Mandatory Interface Implementations

  async generateText(prompt, options = {}) {
    const raw = await this._callGemini(prompt);
    return raw || `[Gemini Output] Response for: "${prompt}"`;
  }

  async chat(messages = [], options = {}) {
    const historyText = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    const prompt = `You are TaskPilot AI Assistant powered by Google Gemini.\n\nConversation Context:\n${historyText}\n\nPlease respond to the user's latest query accurately in Markdown.`;
    
    const raw = await this._callGemini(prompt);
    return raw || `[Gemini Chat Response]: Processed query successfully.`;
  }

  async summarize(text, options = {}) {
    const prompt = PromptBuilder.summaryPrompt(text);
    const raw = await this._callGemini(prompt);
    return raw || `• Summary Point 1: Key insight from content\n• Summary Point 2: Main technical takeaways\n• Summary Point 3: Actionable next step`;
  }

  async generateNotes(topic, options = {}) {
    const prompt = PromptBuilder.notesPrompt(topic);
    const raw = await this._callGemini(prompt);
    return raw || `### ${topic} - Learning Notes\n\n#### Overview\nComprehensive structured notes on ${topic}.\n\n- Key Concept 1\n- Key Concept 2`;
  }

  async generateQuiz(topic, options = {}) {
    const prompt = PromptBuilder.quizPrompt(topic);
    const raw = await this._callGemini(prompt);
    const fallback = [
      { question: `What is the core principle of ${topic}?`, options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'], answer: 0, explanation: `Concept A is fundamental to ${topic}.` }
    ];
    return this._parseJSON(raw, fallback);
  }

  async generateFlashcards(topic, options = {}) {
    const prompt = PromptBuilder.flashcardsPrompt(topic);
    const raw = await this._callGemini(prompt);
    const fallback = [
      { front: `What is ${topic}?`, back: `Core concept definition of ${topic}`, category: 'General' }
    ];
    return this._parseJSON(raw, fallback);
  }

  async generateStudyPlan(topic, options = {}) {
    const prompt = PromptBuilder.studyPlanPrompt(topic);
    const raw = await this._callGemini(prompt);
    const fallback = {
      topic,
      duration: '4 Weeks',
      weeklyPlan: [
        { week: 1, title: `Introduction to ${topic}`, goals: ['Master fundamentals'], dailyHours: 2 }
      ]
    };
    return this._parseJSON(raw, fallback);
  }

  async generateRoadmap(goal, options = {}) {
    const prompt = PromptBuilder.roadmapPrompt(goal);
    const raw = await this._callGemini(prompt);
    const fallback = {
      goal,
      milestones: [
        { step: 1, title: 'Phase 1: Foundations', description: `Learn fundamentals for ${goal}`, estimatedDays: 14, recommendedResources: ['Official Docs'] }
      ]
    };
    return this._parseJSON(raw, fallback);
  }

  async generateTasks(goal, options = {}) {
    const prompt = PromptBuilder.tasksPrompt(goal);
    const raw = await this._callGemini(prompt);
    const fallback = [
      { title: `Study core concept for ${goal}`, category: 'Learning', priority: 'High', estimatedMinutes: 45, xpReward: 50 }
    ];
    return this._parseJSON(raw, fallback);
  }

  async explainTopic(topic, options = {}) {
    const prompt = PromptBuilder.explainPrompt(topic);
    const raw = await this._callGemini(prompt);
    return raw || `### Explaining ${topic}\n\n${topic} is a key software engineering concept. Let's break it down step-by-step...`;
  }

  async generateInterviewQuestions(topic, options = {}) {
    const prompt = PromptBuilder.interviewPrompt(topic);
    const raw = await this._callGemini(prompt);
    const fallback = [
      { question: `How does ${topic} work in production?`, difficulty: 'Medium', modelAnswer: `In production, ${topic} handles system tasks efficiently.`, keyKeywords: [topic] }
    ];
    return this._parseJSON(raw, fallback);
  }

  async generateMermaidDiagram(topic, options = {}) {
    const prompt = PromptBuilder.diagramPrompt(topic);
    const raw = await this._callGemini(prompt);
    const fallback = `graph TD;\n  A[${topic} Goal] --> B[Architecture Plan];\n  B --> C[Implementation];`;
    return this._cleanMermaid(raw, fallback);
  }

  async generateMindMapJSON(topic, options = {}) {
    const prompt = PromptBuilder.mindmapPrompt(topic);
    const raw = await this._callGemini(prompt);
    const fallback = {
      id: 'root',
      label: topic,
      children: [
        { id: 'sub-1', label: 'Core Module', children: [{ id: 'leaf-1', label: 'Details' }] }
      ]
    };
    return this._parseJSON(raw, fallback);
  }
}

export default GeminiProvider;
