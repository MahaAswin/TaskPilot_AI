// AI Service Layer

import { globalProviderManager } from '../providers/ProviderManager.js';
import { PromptBuilder } from '../providers/PromptBuilder.js';

export const aiService = {
  chat: async (messages, options = {}) => {
    return await globalProviderManager.executeMethod('chat', messages, options);
  },

  generateText: async (prompt, options = {}) => {
    const fullPrompt = PromptBuilder.buildPrompt({ userInput: prompt, agentPrompt: options.agent });
    return await globalProviderManager.executeMethod('generateText', fullPrompt, options);
  },

  summarizeText: async (text, options = {}) => {
    return await globalProviderManager.executeMethod('summarize', text, options);
  },

  explainTopic: async (topic, options = {}) => {
    return await globalProviderManager.executeMethod('explain', topic, options);
  },

  generateImage: async (prompt, options = {}) => {
    return await globalProviderManager.executeMethod('generateImage', prompt, options);
  },

  generateDiagram: async (prompt, options = {}) => {
    return await globalProviderManager.executeMethod('generateDiagram', prompt, options);
  },

  generateMindMap: async (prompt, options = {}) => {
    return await globalProviderManager.executeMethod('generateMindMap', prompt, options);
  },

  generateQuiz: async (topic, options = {}) => {
    return await globalProviderManager.executeMethod('generateQuiz', topic, options);
  },

  generateFlashcards: async (topic, options = {}) => {
    return await globalProviderManager.executeMethod('generateFlashcards', topic, options);
  },

  getProvidersData: async () => {
    return [
      { id: 'gemini', name: 'Gemini', model: 'gemini-1.5-pro', providerClass: 'GeminiProvider', priority: 1, isEnabled: true },
      { id: 'grok', name: 'Grok', model: 'grok-beta', providerClass: 'GrokProvider', priority: 2, isEnabled: true },
      { id: 'openai', name: 'OpenAI', model: 'gpt-4o', providerClass: 'OpenAIProvider', priority: 3, isEnabled: true },
      { id: 'claude', name: 'Claude', model: 'claude-3-5-sonnet', providerClass: 'ClaudeProvider', priority: 4, isEnabled: true },
      { id: 'deepseek', name: 'DeepSeek', model: 'deepseek-v3', providerClass: 'DeepSeekProvider', priority: 5, isEnabled: true },
      { id: 'mistral', name: 'Mistral', model: 'mistral-large', providerClass: 'MistralProvider', priority: 6, isEnabled: true },
      { id: 'ollama', name: 'Ollama (Local)', model: 'llama3:8b', providerClass: 'OllamaProvider', priority: 7, isEnabled: true },
      { id: 'mock', name: 'MockProvider', model: 'mock-v1', providerClass: 'MockProvider', priority: 8, isEnabled: true }
    ];
  },

  getHealthData: async () => {
    return globalProviderManager.getHealth();
  }
};

export default aiService;
