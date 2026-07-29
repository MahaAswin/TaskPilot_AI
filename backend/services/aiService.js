// AI Service Layer (Routes through ProviderManager with Failover Guarantees)

import { globalProviderManager } from '../providers/ProviderManager.js';

export const aiService = {
  chat: async (messages, options = {}) => {
    const formatted = await globalProviderManager.executeMethod('chat', messages, options);
    const result = formatted.rawResult || formatted.response;
    return {
      provider: formatted.provider,
      model: formatted.metadata?.model || 'default',
      response: typeof result === 'string' ? result : JSON.stringify(result),
      timestamp: new Date().toISOString()
    };
  },

  summarize: async (text, options = {}) => {
    const formatted = await globalProviderManager.executeMethod('summarize', text, options);
    const result = formatted.rawResult || formatted.response;
    return { provider: formatted.provider, response: result };
  },

  generateNotes: async (topic, options = {}) => {
    const formatted = await globalProviderManager.executeMethod('generateNotes', topic, options);
    const result = formatted.rawResult || formatted.response;
    return { provider: formatted.provider, topic, response: result };
  },

  generateQuiz: async (topic, options = {}) => {
    const formatted = await globalProviderManager.executeMethod('generateQuiz', topic, options);
    const result = formatted.rawResult || formatted.response;
    return { provider: formatted.provider, topic, data: result };
  },

  generateFlashcards: async (topic, options = {}) => {
    const formatted = await globalProviderManager.executeMethod('generateFlashcards', topic, options);
    const result = formatted.rawResult || formatted.response;
    return { provider: formatted.provider, topic, data: result };
  },

  generateStudyPlan: async (topic, options = {}) => {
    const formatted = await globalProviderManager.executeMethod('generateStudyPlan', topic, options);
    const result = formatted.rawResult || formatted.response;
    return { provider: formatted.provider, topic, data: result };
  },

  generateRoadmap: async (goal, options = {}) => {
    const formatted = await globalProviderManager.executeMethod('generateRoadmap', goal, options);
    const rawResult = formatted.rawResult;
    // rawResult can be: string, { goal, response, milestones } or { goal, milestones }
    return {
      provider: formatted.provider,
      goal,
      response: typeof rawResult === 'string' ? rawResult : (rawResult?.response || formatted.response || ''),
      data: rawResult
    };
  },

  generateTasks: async (goal, options = {}) => {
    const formatted = await globalProviderManager.executeMethod('generateTasks', goal, options);
    const result = formatted.rawResult || formatted.response;
    return { provider: formatted.provider, goal, data: result };
  },

  explainTopic: async (topic, options = {}) => {
    const formatted = await globalProviderManager.executeMethod('explainTopic', topic, options);
    const result = formatted.rawResult || formatted.response;
    return { provider: formatted.provider, topic, response: result };
  },

  generateInterviewQuestions: async (topic, options = {}) => {
    const formatted = await globalProviderManager.executeMethod('generateInterviewQuestions', topic, options);
    const result = formatted.rawResult || formatted.response;
    return { provider: formatted.provider, topic, data: result };
  },

  generateMermaidDiagram: async (topic, options = {}) => {
    const formatted = await globalProviderManager.executeMethod('generateMermaidDiagram', topic, options);
    const result = formatted.rawResult || formatted.response;
    return { provider: formatted.provider, topic, diagram: result };
  },

  generateMindMapJSON: async (topic, options = {}) => {
    const formatted = await globalProviderManager.executeMethod('generateMindMapJSON', topic, options);
    const result = formatted.rawResult || formatted.response;
    return { provider: formatted.provider, topic, mindMap: result };
  },

  getProvidersData: async () => {
    return [
      { id: 'gemini', name: 'Gemini', model: process.env.GEMINI_MODEL || 'gemini-1.5-flash', providerClass: 'GeminiProvider', isDefault: true, isEnabled: true },
      { id: 'grok', name: 'Grok (xAI)', model: 'grok-beta', providerClass: 'GrokProvider', isDefault: false, isEnabled: true },
      { id: 'ollama', name: 'Ollama (Local)', model: process.env.OLLAMA_MODEL || 'qwen3:8b', providerClass: 'OllamaProvider', isDefault: false, isEnabled: true },
      { id: 'openrouter', name: 'OpenRouter', model: 'meta-llama/llama-3.1-8b-instruct:free', providerClass: 'OpenRouterProvider', isDefault: false, isEnabled: true },
      { id: 'huggingface', name: 'HuggingFace', model: 'mistralai/Mistral-7B-Instruct-v0.2', providerClass: 'HuggingFaceProvider', isDefault: false, isEnabled: true },
      { id: 'openai', name: 'OpenAI', model: 'gpt-4o', providerClass: 'OpenAIProvider', isDefault: false, isEnabled: true },
      { id: 'claude', name: 'Claude', model: 'claude-3-5-sonnet', providerClass: 'ClaudeProvider', isDefault: false, isEnabled: true },
      { id: 'deepseek', name: 'DeepSeek', model: 'deepseek-v3', providerClass: 'DeepSeekProvider', isDefault: false, isEnabled: true },
      { id: 'mistral', name: 'Mistral', model: 'mistral-large', providerClass: 'MistralProvider', isDefault: false, isEnabled: true },
      { id: 'mock', name: 'MockProvider', model: 'mock-v1', providerClass: 'MockProvider', isDefault: false, isEnabled: true }
    ];
  },

  getHealthData: async () => {
    return globalProviderManager.getHealth();
  }
};

export default aiService;
