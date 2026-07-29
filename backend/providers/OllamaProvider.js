import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { BaseProvider } from './BaseProvider.js';
import { PromptBuilder } from './PromptBuilder.js';

// Ensure dotenv is loaded before provider initialization
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env'), override: true });
dotenv.config({ path: path.join(__dirname, '../.env'), override: true });

export class OllamaProvider extends BaseProvider {
  constructor(config = {}) {
    const baseUrl = (config.baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/+$/, '');
    const model = config.model || process.env.OLLAMA_MODEL || 'qwen3:8b';

    super({ 
      name: 'Ollama', 
      model, 
      baseUrl,
      ...config 
    });

    this.baseUrl = baseUrl;
    this.model = model;

    console.log("OLLAMA_BASE_URL =", process.env.OLLAMA_BASE_URL || this.baseUrl);
    console.log("OLLAMA_MODEL =", process.env.OLLAMA_MODEL || this.model);
  }

  _formatAxiosError(err) {
    if (!err) return 'Unknown error';
    const status = err.response?.status;
    const statusText = err.response?.statusText || '';
    const bodyData = err.response?.data ? (typeof err.response.data === 'object' ? JSON.stringify(err.response.data) : String(err.response.data)) : '';
    const code = err.code || '';
    const message = err.message || String(err);

    let parts = [];
    if (status) parts.push(`HTTP Status: ${status} ${statusText}`.trim());
    if (code) parts.push(`Error Code: ${code}`);
    if (message) parts.push(`Message: ${message}`);
    if (bodyData) parts.push(`Response Body: ${bodyData}`);

    return parts.join(' | ') || String(err);
  }

  async isHealthy() {
    try {
      const tagsUrl = `${this.baseUrl}/api/tags`;
      await axios.get(tagsUrl, { timeout: 10000 });
      return true;
    } catch (err) {
      console.warn(`[OllamaProvider Health Check Failed] ${this.baseUrl}/api/tags: ${this._formatAxiosError(err)}`);
      return false;
    }
  }

  /**
   * Execute call to Ollama endpoint (/api/chat or /api/generate)
   */
  async _callOllama(promptText, isChat = false, messages = null) {
    const startTime = Date.now();
    const endpoint = isChat ? `${this.baseUrl}/api/chat` : `${this.baseUrl}/api/generate`;
    const modelName = process.env.OLLAMA_MODEL || this.model || 'qwen3:8b';

    const requestBody = isChat
      ? {
          model: modelName,
          messages: messages || [{ role: 'user', content: promptText }],
          stream: false
        }
      : {
          model: modelName,
          prompt: promptText,
          stream: false
        };

    console.log(`====================================================`);
    console.log(`Ollama Base URL:\n${this.baseUrl}`);
    console.log(`Endpoint:\n${endpoint}`);
    console.log(`Model:\n${modelName}`);
    console.log(`Request Body:\n${JSON.stringify(requestBody, null, 2)}`);
    console.log(`====================================================`);

    // Logger to report elapsed time if generation exceeds 60 seconds
    const intervalTimer = setInterval(() => {
      const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[Ollama Progress] Local generation in progress... elapsed time: ${elapsedSec} seconds`);
    }, 60000);

    try {
      const response = await axios.post(endpoint, requestBody, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 180000 // 180,000 ms (3 minutes HTTP timeout)
      });

      clearInterval(intervalTimer);
      const requestDurationMs = Date.now() - startTime;

      const loadDurationNs = response.data?.load_duration;
      const evalDurationNs = response.data?.eval_duration;

      console.log(`\n====================================================`);
      console.log(`[Ollama Telemetry] Total Request Duration: ${requestDurationMs} ms (${(requestDurationMs / 1000).toFixed(1)}s)`);
      if (loadDurationNs) console.log(`[Ollama Telemetry] Model Load Duration: ${(loadDurationNs / 1e6).toFixed(0)} ms`);
      if (evalDurationNs) console.log(`[Ollama Telemetry] Generation Duration: ${(evalDurationNs / 1e6).toFixed(0)} ms`);
      console.log(`====================================================\n`);

      const text = isChat 
        ? response.data?.message?.content 
        : response.data?.response;

      if (!text) {
        throw new Error(`Ollama returned empty response content from endpoint [${endpoint}]`);
      }

      return this._cleanThinking(text);
    } catch (err) {
      clearInterval(intervalTimer);
      const requestDurationMs = Date.now() - startTime;

      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        const timeoutMsg = `Ollama request timed out after ${requestDurationMs} ms (${(requestDurationMs / 1000).toFixed(1)}s) at endpoint [${endpoint}].`;
        console.error(`[Ollama Timeout Error]`, timeoutMsg);
        throw new Error(timeoutMsg);
      } else {
        const detailedError = `Ollama Request Failed at ${endpoint}: ${this._formatAxiosError(err)}`;
        console.error(`[Ollama Connection Error]`, detailedError);
        throw new Error(detailedError);
      }
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
    if (Array.isArray(messages) && messages.length > 0) {
      return await this._callOllama('', true, messages);
    }
    const promptText = PromptBuilder.chatPrompt(messages);
    return await this._callOllama(promptText, false);
  }

  async generateText(prompt, options = {}) {
    return await this._callOllama(prompt, false);
  }

  async summarize(text, options = {}) {
    const promptText = PromptBuilder.summaryPrompt(text);
    return await this._callOllama(promptText, false);
  }

  async generateNotes(topic, options = {}) {
    const promptText = PromptBuilder.notesPrompt(topic);
    return await this._callOllama(promptText, false);
  }

  async generateQuiz(topic, options = {}) {
    const promptText = PromptBuilder.quizPrompt(topic);
    const raw = await this._callOllama(promptText, false);
    return this._parseJSON(raw);
  }

  async generateFlashcards(topic, options = {}) {
    const promptText = PromptBuilder.flashcardsPrompt(topic);
    const raw = await this._callOllama(promptText, false);
    return this._parseJSON(raw);
  }

  async generateStudyPlan(topic, options = {}) {
    const promptText = PromptBuilder.studyPlanPrompt(topic);
    const raw = await this._callOllama(promptText, false);
    return this._parseJSON(raw);
  }

  async generateRoadmap(goal, options = {}) {
    const promptText = PromptBuilder.roadmapPrompt(goal);
    const raw = await this._callOllama(promptText, false);
    return this._parseJSON(raw);
  }

  async generateTasks(goal, options = {}) {
    const promptText = PromptBuilder.tasksPrompt(goal);
    const raw = await this._callOllama(promptText, false);
    return this._parseJSON(raw);
  }

  async explainTopic(topic, options = {}) {
    const promptText = PromptBuilder.explainPrompt(topic);
    return await this._callOllama(promptText, false);
  }

  async generateInterviewQuestions(topic, options = {}) {
    const promptText = PromptBuilder.interviewPrompt(topic);
    const raw = await this._callOllama(promptText, false);
    return this._parseJSON(raw);
  }

  async generateMermaidDiagram(topic, options = {}) {
    const promptText = PromptBuilder.diagramPrompt(topic);
    const raw = await this._callOllama(promptText, false);
    return this._cleanMermaid(raw);
  }

  async generateMindMapJSON(topic, options = {}) {
    const promptText = PromptBuilder.mindmapPrompt(topic);
    const raw = await this._callOllama(promptText, false);
    return this._parseJSON(raw);
  }

  async generateImage(prompt, options = {}) {
    return { error: 'Image generation is not supported by Ollama.' };
  }
}

export default OllamaProvider;
