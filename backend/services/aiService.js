// AI Service Layer (Routes through GeminiProvider via ProviderManager)

import { globalProviderManager } from '../providers/ProviderManager.js';

export const aiService = {
  chat: async (messages, options = {}) => {
    const provider = globalProviderManager.getProvider(options.provider);
    const result = await provider.chat(messages, options);
    return {
      provider: provider.name,
      model: provider.model,
      response: typeof result === 'string' ? result : JSON.stringify(result),
      timestamp: new Date().toISOString()
    };
  },

  summarize: async (text, options = {}) => {
    const provider = globalProviderManager.getProvider(options.provider);
    const result = await provider.summarize(text, options);
    return { provider: provider.name, response: result };
  },

  generateNotes: async (topic, options = {}) => {
    const provider = globalProviderManager.getProvider(options.provider);
    const result = await provider.generateNotes(topic, options);
    return { provider: provider.name, topic, response: result };
  },

  generateQuiz: async (topic, options = {}) => {
    const provider = globalProviderManager.getProvider(options.provider);
    const result = await provider.generateQuiz(topic, options);
    return { provider: provider.name, topic, data: result };
  },

  generateFlashcards: async (topic, options = {}) => {
    const provider = globalProviderManager.getProvider(options.provider);
    const result = await provider.generateFlashcards(topic, options);
    return { provider: provider.name, topic, data: result };
  },

  generateStudyPlan: async (topic, options = {}) => {
    const provider = globalProviderManager.getProvider(options.provider);
    const result = await provider.generateStudyPlan(topic, options);
    return { provider: provider.name, topic, data: result };
  },

  generateRoadmap: async (goal, options = {}) => {
    const provider = globalProviderManager.getProvider(options.provider);
    const result = await provider.generateRoadmap(goal, options);
    return { provider: provider.name, goal, data: result };
  },

  generateTasks: async (goal, options = {}) => {
    const provider = globalProviderManager.getProvider(options.provider);
    const result = await provider.generateTasks(goal, options);
    return { provider: provider.name, goal, data: result };
  },

  explainTopic: async (topic, options = {}) => {
    const provider = globalProviderManager.getProvider(options.provider);
    const result = await provider.explainTopic(topic, options);
    return { provider: provider.name, topic, response: result };
  },

  generateInterviewQuestions: async (topic, options = {}) => {
    const provider = globalProviderManager.getProvider(options.provider);
    const result = await provider.generateInterviewQuestions(topic, options);
    return { provider: provider.name, topic, data: result };
  },

  generateMermaidDiagram: async (topic, options = {}) => {
    const provider = globalProviderManager.getProvider(options.provider);
    const result = await provider.generateMermaidDiagram(topic, options);
    return { provider: provider.name, topic, diagram: result };
  },

  generateMindMapJSON: async (topic, options = {}) => {
    const provider = globalProviderManager.getProvider(options.provider);
    const result = await provider.generateMindMapJSON(topic, options);
    return { provider: provider.name, topic, mindMap: result };
  },

  getProvidersData: async () => {
    return [
      { id: 'gemini', name: 'Gemini', model: 'gemini-1.5-pro', providerClass: 'GeminiProvider', isDefault: true, isEnabled: true },
      { id: 'grok', name: 'Grok', model: 'grok-beta', providerClass: 'GrokProvider', isDefault: false, isEnabled: true },
      { id: 'openai', name: 'OpenAI', model: 'gpt-4o', providerClass: 'OpenAIProvider', isDefault: false, isEnabled: true },
      { id: 'claude', name: 'Claude', model: 'claude-3-5-sonnet', providerClass: 'ClaudeProvider', isDefault: false, isEnabled: true },
      { id: 'deepseek', name: 'DeepSeek', model: 'deepseek-v3', providerClass: 'DeepSeekProvider', isDefault: false, isEnabled: true },
      { id: 'mistral', name: 'Mistral', model: 'mistral-large', providerClass: 'MistralProvider', isDefault: false, isEnabled: true },
      { id: 'ollama', name: 'Ollama (Local)', model: 'llama3:8b', providerClass: 'OllamaProvider', isDefault: false, isEnabled: true },
      { id: 'mock', name: 'MockProvider', model: 'mock-v1', providerClass: 'MockProvider', isDefault: false, isEnabled: true }
    ];
  },

  getHealthData: async () => {
    return globalProviderManager.getHealth();
  }
};

export default aiService;
