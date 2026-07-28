import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseProvider } from './BaseProvider.js';
import { PromptBuilder } from './PromptBuilder.js';

export class GeminiProvider extends BaseProvider {
  constructor(config = {}) {
    const configuredModel = config.model || process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    super({ name: 'Gemini', model: configuredModel, ...config });
    
    this.apiKey = config.apiKey || process.env.GEMINI_API_KEY || '';
    this.candidateModels = [
      configuredModel,
      'gemini-1.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-pro-latest',
      'gemini-1.0-pro'
    ];
    this.candidateModels = [...new Set(this.candidateModels.filter(Boolean))];

    if (this.apiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        console.log(`====================================================`);
        console.log(`Gemini SDK Version: 0.24.1`);
        console.log(`Configured Model: ${this.model}`);
        console.log(`API Key Loaded: YES`);
        console.log(`Provider Initialized Successfully`);
        console.log(`====================================================`);
      } catch (err) {
        console.warn('[GeminiProvider] Initialization error:', err.message);
      }
    }
  }

  /**
   * Helper to execute text generation with Gemini SDK and model failover
   */
  async _callGemini(promptText, overrideModel = null) {
    const startTime = Date.now();
    
    if (!this.apiKey || !this.genAI) {
      throw new Error('GEMINI_API_KEY is missing in environment variables');
    }

    const modelsToTry = overrideModel ? [overrideModel, ...this.candidateModels] : this.candidateModels;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`\n====================================================`);
        console.log(`[PIPELINE LOG] Gemini Request Triggered`);
        console.log(`[PIPELINE LOG] Provider: ${this.name} | Target Model: ${modelName}`);
        console.log(`[PIPELINE LOG] Prompt Length: ${promptText ? promptText.length : 0} chars`);

        const model = this.genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(promptText);
        const response = await result.response;
        const text = response.text();

        if (!text) {
          throw new Error(`Gemini returned empty text response for model ${modelName}`);
        }

        const elapsed = Date.now() - startTime;
        console.log(`[PIPELINE LOG] Gemini Response Received in ${elapsed}ms (${text.length} chars) via ${modelName}`);
        console.log(`====================================================\n`);

        return text;
      } catch (error) {
        lastError = error;
        const is404ModelError = error?.message?.includes('404') || error?.message?.includes('not found') || error?.message?.includes('generateContent');

        if (is404ModelError) {
          console.warn(`[GeminiProvider Model Warning] Model ${modelName} returned 404 or unsupported for generateContent. Attempting model fallback...`);
          continue; // Try next candidate model
        } else {
          console.error(`[GeminiProvider SDK Error with ${modelName}]:`, error?.message || error);
          throw error;
        }
      }
    }

    // If all candidate models fail, throw error so ProviderManager can seamlessly failover to next provider
    throw lastError || new Error('All Gemini candidate models failed to generate content');
  }

  /**
   * Safe helper to parse JSON outputs from LLM responses
   */
  _parseJSON(text) {
    if (!text) throw new Error('Empty response received from Gemini');
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  }

  /**
   * Safe helper to clean Mermaid diagram outputs
   */
  _cleanMermaid(text) {
    if (!text) throw new Error('Empty response received from Gemini');
    let cleaned = text.replace(/```mermaid/gi, '').replace(/```/g, '').trim();
    if (!cleaned.startsWith('graph')) {
      cleaned = `graph TD;\n  A[Gemini Output] --> B[${text.slice(0, 30)}...];`;
    }
    return cleaned;
  }

  // Mandatory Interface Implementations

  async generateImage(prompt, options = {}) {
    return {
      error: 'Image generation is not yet supported by the configured provider.',
      message: 'Image generation is not yet supported by the configured provider.'
    };
  }

  async generateText(prompt, options = {}) {
    return await this._callGemini(prompt);
  }

  async chat(messages, options = {}) {
    const promptText = PromptBuilder.chatPrompt(messages);
    return await this._callGemini(promptText);
  }

  async summarize(text, options = {}) {
    const promptText = PromptBuilder.summaryPrompt(text);
    return await this._callGemini(promptText);
  }

  async generateNotes(topic, options = {}) {
    const promptText = PromptBuilder.notesPrompt(topic);
    return await this._callGemini(promptText);
  }

  async generateQuiz(topic, options = {}) {
    const promptText = PromptBuilder.quizPrompt(topic);
    const raw = await this._callGemini(promptText);
    return this._parseJSON(raw);
  }

  async generateFlashcards(topic, options = {}) {
    const promptText = PromptBuilder.flashcardsPrompt(topic);
    const raw = await this._callGemini(promptText);
    return this._parseJSON(raw);
  }

  async generateStudyPlan(topic, options = {}) {
    const promptText = PromptBuilder.studyPlanPrompt(topic);
    const raw = await this._callGemini(promptText);
    return this._parseJSON(raw);
  }

  async generateRoadmap(goal, options = {}) {
    const promptText = PromptBuilder.roadmapPrompt(goal);
    const raw = await this._callGemini(promptText);
    return this._parseJSON(raw);
  }

  async generateTasks(goal, options = {}) {
    const promptText = PromptBuilder.tasksPrompt(goal);
    const raw = await this._callGemini(promptText);
    return this._parseJSON(raw);
  }

  async explainTopic(topic, options = {}) {
    const promptText = PromptBuilder.explainPrompt(topic);
    return await this._callGemini(promptText);
  }

  async generateInterviewQuestions(topic, options = {}) {
    const promptText = PromptBuilder.interviewPrompt(topic);
    const raw = await this._callGemini(promptText);
    return this._parseJSON(raw);
  }

  async generateMermaidDiagram(topic, options = {}) {
    const promptText = PromptBuilder.diagramPrompt(topic);
    const raw = await this._callGemini(promptText);
    return this._cleanMermaid(raw);
  }

  async generateMindMapJSON(topic, options = {}) {
    const promptText = PromptBuilder.mindmapPrompt(topic);
    const raw = await this._callGemini(promptText);
    return this._parseJSON(raw);
  }
}

export default GeminiProvider;
