import axios from 'axios';
import { BaseProvider } from './BaseProvider.js';
import { PromptBuilder } from './PromptBuilder.js';

export class OpenRouterProvider extends BaseProvider {
  constructor(config = {}) {
    super({ name: 'OpenRouter', model: config.model || 'meta-llama/llama-3.1-8b-instruct:free', ...config });
    this.apiKey = config.apiKey || process.env.OPENROUTER_API_KEY || '';
    this.baseURL = 'https://openrouter.ai/api/v1/chat/completions';
  }

  async isHealthy() {
    return !!this.apiKey;
  }

  async _callOpenRouter(promptText) {
    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY is missing in environment variables');
    }

    const response = await axios.post(
      this.baseURL,
      {
        model: this.model,
        messages: [{ role: 'user', content: promptText }]
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://taskpilot.ai',
          'X-Title': 'TaskPilot AI',
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const text = response.data?.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error('OpenRouter API returned empty response content');
    }
    return text;
  }

  _parseJSON(text) {
    if (!text) throw new Error('Empty response received from OpenRouter');
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  }

  _cleanMermaid(text) {
    if (!text) throw new Error('Empty response received from OpenRouter');
    let cleaned = text.replace(/```mermaid/gi, '').replace(/```/g, '').trim();
    if (!cleaned.startsWith('graph')) {
      cleaned = `graph TD;\n  A[OpenRouter Output] --> B[${text.slice(0, 30)}...];`;
    }
    return cleaned;
  }

  async chat(messages, options = {}) {
    const promptText = PromptBuilder.chatPrompt(messages);
    return await this._callOpenRouter(promptText);
  }

  async summarize(text, options = {}) {
    const promptText = PromptBuilder.summaryPrompt(text);
    return await this._callOpenRouter(promptText);
  }

  async generateNotes(topic, options = {}) {
    const promptText = PromptBuilder.notesPrompt(topic);
    return await this._callOpenRouter(promptText);
  }

  async generateQuiz(topic, options = {}) {
    const promptText = PromptBuilder.quizPrompt(topic);
    const raw = await this._callOpenRouter(promptText);
    return this._parseJSON(raw);
  }

  async generateFlashcards(topic, options = {}) {
    const promptText = PromptBuilder.flashcardsPrompt(topic);
    const raw = await this._callOpenRouter(promptText);
    return this._parseJSON(raw);
  }

  async generateStudyPlan(topic, options = {}) {
    const promptText = PromptBuilder.studyPlanPrompt(topic);
    const raw = await this._callOpenRouter(promptText);
    return this._parseJSON(raw);
  }

  async generateRoadmap(goal, options = {}) {
    const promptText = PromptBuilder.roadmapPrompt(goal);
    const raw = await this._callOpenRouter(promptText);
    return this._parseJSON(raw);
  }

  async generateTasks(goal, options = {}) {
    const promptText = PromptBuilder.tasksPrompt(goal);
    const raw = await this._callOpenRouter(promptText);
    return this._parseJSON(raw);
  }

  async explainTopic(topic, options = {}) {
    const promptText = PromptBuilder.explainPrompt(topic);
    return await this._callOpenRouter(promptText);
  }

  async generateInterviewQuestions(topic, options = {}) {
    const promptText = PromptBuilder.interviewPrompt(topic);
    const raw = await this._callOpenRouter(promptText);
    return this._parseJSON(raw);
  }

  async generateMermaidDiagram(topic, options = {}) {
    const promptText = PromptBuilder.diagramPrompt(topic);
    const raw = await this._callOpenRouter(promptText);
    return this._cleanMermaid(raw);
  }

  async generateMindMapJSON(topic, options = {}) {
    const promptText = PromptBuilder.mindmapPrompt(topic);
    const raw = await this._callOpenRouter(promptText);
    return this._parseJSON(raw);
  }

  async generateImage(prompt, options = {}) {
    return { error: 'Image generation is not yet supported by the configured provider.' };
  }
}

export default OpenRouterProvider;
