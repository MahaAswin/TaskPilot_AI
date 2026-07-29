import axios from 'axios';
import { BaseProvider } from './BaseProvider.js';
import { PromptBuilder } from './PromptBuilder.js';

export class OllamaProvider extends BaseProvider {
  constructor(config = {}) {
    super({ 
      name: 'Ollama', 
      model: config.model || process.env.OLLAMA_MODEL || 'qwen3:8b', 
      baseUrl: config.baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      ...config 
    });
  }

  async isHealthy() {
    try {
      await axios.get(`${this.baseUrl}/api/tags`, { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async getAvailableModel() {
    try {
      const res = await axios.get(`${this.baseUrl}/api/tags`, { timeout: 3000 });
      const models = res.data?.models || [];
      if (models.length > 0) {
        const found = models.find(m => m.name === this.model || m.model === this.model);
        if (found) return found.name || found.model;
        return models[0].name || models[0].model;
      }
    } catch (e) {
      console.warn('[OllamaProvider] Failed to fetch tags:', e.message);
    }
    return this.model || 'qwen3:8b';
  }

  async _callOllama(promptText) {
    let targetModel = this.model;
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/generate`,
        {
          model: targetModel,
          prompt: promptText,
          stream: false,
          options: {
            num_predict: 750
          }
        },
        { timeout: 120000 }
      );

      const text = response.data?.response;
      if (!text) {
        throw new Error('Ollama returned empty response string');
      }
      return this._cleanThinking(text);
    } catch (err) {
      const isNotFound = err.response?.status === 404 || 
                         err.message?.includes('not found') || 
                         err.response?.data?.error?.includes('not found');

      if (isNotFound) {
        const fallbackModel = await this.getAvailableModel();
        if (fallbackModel && fallbackModel !== targetModel) {
          console.log(`[OllamaProvider] Target model '${targetModel}' not available. Auto-switching to '${fallbackModel}'...`);
          this.model = fallbackModel;
          const retryRes = await axios.post(
            `${this.baseUrl}/api/generate`,
            {
              model: fallbackModel,
              prompt: promptText,
              stream: false,
              options: {
                num_predict: 750
              }
            },
            { timeout: 120000 }
          );
          const text = retryRes.data?.response;
          if (text) return this._cleanThinking(text);
        }
      }
      throw err;
    }
  }

  _cleanThinking(text) {
    if (!text) return '';
    let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    if (!cleaned) {
      cleaned = text.replace(/<\/?think>/gi, '').trim();
    }
    return cleaned;
  }

  _parseJSON(text) {
    if (!text) throw new Error('Empty response received from Ollama');
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  }

  _cleanMermaid(text) {
    if (!text) throw new Error('Empty response received from Ollama');
    let cleaned = text.replace(/```mermaid/gi, '').replace(/```/g, '').trim();
    if (!cleaned.startsWith('graph')) {
      cleaned = `graph TD;\n  A[Ollama Output] --> B[${text.slice(0, 30)}...];`;
    }
    return cleaned;
  }

  async chat(messages, options = {}) {
    const promptText = PromptBuilder.chatPrompt(messages);
    return await this._callOllama(promptText);
  }

  async generateText(prompt, options = {}) {
    return await this._callOllama(prompt);
  }

  async summarize(text, options = {}) {
    const promptText = PromptBuilder.summaryPrompt(text);
    return await this._callOllama(promptText);
  }

  async generateNotes(topic, options = {}) {
    const promptText = PromptBuilder.notesPrompt(topic);
    return await this._callOllama(promptText);
  }

  async generateQuiz(topic, options = {}) {
    const promptText = PromptBuilder.quizPrompt(topic);
    const raw = await this._callOllama(promptText);
    return this._parseJSON(raw);
  }

  async generateFlashcards(topic, options = {}) {
    const promptText = PromptBuilder.flashcardsPrompt(topic);
    const raw = await this._callOllama(promptText);
    return this._parseJSON(raw);
  }

  async generateStudyPlan(topic, options = {}) {
    const promptText = PromptBuilder.studyPlanPrompt(topic);
    const raw = await this._callOllama(promptText);
    return this._parseJSON(raw);
  }

  async generateRoadmap(goal, options = {}) {
    const promptText = PromptBuilder.roadmapPrompt(goal);
    const raw = await this._callOllama(promptText);
    return this._parseJSON(raw);
  }

  async generateTasks(goal, options = {}) {
    const promptText = PromptBuilder.tasksPrompt(goal);
    const raw = await this._callOllama(promptText);
    return this._parseJSON(raw);
  }

  async explainTopic(topic, options = {}) {
    const promptText = PromptBuilder.explainPrompt(topic);
    return await this._callOllama(promptText);
  }

  async generateInterviewQuestions(topic, options = {}) {
    const promptText = PromptBuilder.interviewPrompt(topic);
    const raw = await this._callOllama(promptText);
    return this._parseJSON(raw);
  }

  async generateMermaidDiagram(topic, options = {}) {
    const promptText = PromptBuilder.diagramPrompt(topic);
    const raw = await this._callOllama(promptText);
    return this._cleanMermaid(raw);
  }

  async generateMindMapJSON(topic, options = {}) {
    const promptText = PromptBuilder.mindmapPrompt(topic);
    const raw = await this._callOllama(promptText);
    return this._parseJSON(raw);
  }

  async generateImage(prompt, options = {}) {
    return { error: 'Image generation is not yet supported by the configured provider.' };
  }
}

export default OllamaProvider;
