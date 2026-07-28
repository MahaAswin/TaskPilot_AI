import axios from 'axios';
import { BaseProvider } from './BaseProvider.js';
import { PromptBuilder } from './PromptBuilder.js';

export class OllamaProvider extends BaseProvider {
  constructor(config = {}) {
    super({ 
      name: 'Ollama', 
      model: config.model || process.env.OLLAMA_MODEL || 'llama3:8b', 
      baseUrl: config.baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      ...config 
    });
  }

  async isHealthy() {
    try {
      await axios.get(`${this.baseUrl}/api/tags`, { timeout: 1200 });
      return true;
    } catch {
      return false;
    }
  }

  async _callOllama(promptText) {
    const response = await axios.post(
      `${this.baseUrl}/api/generate`,
      {
        model: this.model,
        prompt: promptText,
        stream: false
      },
      { timeout: 15000 }
    );

    const text = response.data?.response;
    if (!text) {
      throw new Error('Ollama returned empty response string');
    }
    return text;
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
