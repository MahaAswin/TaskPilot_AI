import axios from 'axios';
import { BaseProvider } from './BaseProvider.js';
import { PromptBuilder } from './PromptBuilder.js';

export class HuggingFaceProvider extends BaseProvider {
  constructor(config = {}) {
    super({ name: 'HuggingFace', model: config.model || 'mistralai/Mistral-7B-Instruct-v0.2', ...config });
    this.apiKey = config.apiKey || process.env.HUGGINGFACE_API_KEY || process.env.HF_API_KEY || '';
  }

  async isHealthy() {
    return !!this.apiKey;
  }

  async _callHuggingFace(promptText) {
    if (!this.apiKey) {
      throw new Error('HUGGINGFACE_API_KEY is missing in environment variables');
    }

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${this.model}`,
      { inputs: promptText, parameters: { max_new_tokens: 1024 } },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 12000
      }
    );

    let text = '';
    if (Array.isArray(response.data) && response.data[0]?.generated_text) {
      text = response.data[0].generated_text.replace(promptText, '').trim();
    } else if (typeof response.data === 'string') {
      text = response.data;
    } else {
      text = JSON.stringify(response.data);
    }

    if (!text) {
      throw new Error('HuggingFace API returned empty response content');
    }
    return text;
  }

  _parseJSON(text) {
    if (!text) throw new Error('Empty response received from HuggingFace');
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  }

  _cleanMermaid(text) {
    if (!text) throw new Error('Empty response received from HuggingFace');
    let cleaned = text.replace(/```mermaid/gi, '').replace(/```/g, '').trim();
    if (!cleaned.startsWith('graph')) {
      cleaned = `graph TD;\n  A[HuggingFace Output] --> B[${text.slice(0, 30)}...];`;
    }
    return cleaned;
  }

  async chat(messages, options = {}) {
    const promptText = PromptBuilder.chatPrompt(messages);
    return await this._callHuggingFace(promptText);
  }

  async summarize(text, options = {}) {
    const promptText = PromptBuilder.summaryPrompt(text);
    return await this._callHuggingFace(promptText);
  }

  async generateNotes(topic, options = {}) {
    const promptText = PromptBuilder.notesPrompt(topic);
    return await this._callHuggingFace(promptText);
  }

  async generateQuiz(topic, options = {}) {
    const promptText = PromptBuilder.quizPrompt(topic);
    const raw = await this._callHuggingFace(promptText);
    return this._parseJSON(raw);
  }

  async generateFlashcards(topic, options = {}) {
    const promptText = PromptBuilder.flashcardsPrompt(topic);
    const raw = await this._callHuggingFace(promptText);
    return this._parseJSON(raw);
  }

  async generateStudyPlan(topic, options = {}) {
    const promptText = PromptBuilder.studyPlanPrompt(topic);
    const raw = await this._callHuggingFace(promptText);
    return this._parseJSON(raw);
  }

  async generateRoadmap(goal, options = {}) {
    const promptText = PromptBuilder.roadmapPrompt(goal);
    const raw = await this._callHuggingFace(promptText);
    return this._parseJSON(raw);
  }

  async generateTasks(goal, options = {}) {
    const promptText = PromptBuilder.tasksPrompt(goal);
    const raw = await this._callHuggingFace(promptText);
    return this._parseJSON(raw);
  }

  async explainTopic(topic, options = {}) {
    const promptText = PromptBuilder.explainPrompt(topic);
    return await this._callHuggingFace(promptText);
  }

  async generateInterviewQuestions(topic, options = {}) {
    const promptText = PromptBuilder.interviewPrompt(topic);
    const raw = await this._callHuggingFace(promptText);
    return this._parseJSON(raw);
  }

  async generateMermaidDiagram(topic, options = {}) {
    const promptText = PromptBuilder.diagramPrompt(topic);
    const raw = await this._callHuggingFace(promptText);
    return this._cleanMermaid(raw);
  }

  async generateMindMapJSON(topic, options = {}) {
    const promptText = PromptBuilder.mindmapPrompt(topic);
    const raw = await this._callHuggingFace(promptText);
    return this._parseJSON(raw);
  }

  async generateImage(prompt, options = {}) {
    return { error: 'Image generation is not yet supported by the configured provider.' };
  }
}

export default HuggingFaceProvider;
