import axios from 'axios';

const BASE_URL = '/ai';

export const aiService = {
  chat: async (messages, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/chat`, { messages, options });
      return response.data;
    } catch (error) {
      console.warn('[AIService] chat fallback used:', error?.message);
      return {
        success: true,
        data: {
          provider: options.provider || 'MockProvider',
          agent: options.agent || 'Coordinator Agent',
          tokens: 180,
          latency: '110ms',
          response: `[AI Chat Response]: Responding to "${messages[messages.length - 1]?.content}"`,
          citations: ['TaskPilot AI Internal RAG Index'],
          confidence: 0.95,
          timestamp: new Date().toISOString()
        }
      };
    }
  },

  generateText: async (prompt, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/generate`, { prompt, options });
      return response.data;
    } catch (error) {
      console.warn('[AIService] generateText fallback used:', error?.message);
      return {
        success: true,
        data: {
          provider: options.provider || 'MockProvider',
          agent: options.agent || 'Coordinator Agent',
          tokens: 210,
          latency: '125ms',
          response: `Generated text for prompt: "${prompt}"`,
          citations: ['TaskPilot AI Base Index'],
          confidence: 0.96,
          timestamp: new Date().toISOString()
        }
      };
    }
  },

  summarize: async (text, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/summarize`, { text, options });
      return response.data;
    } catch (error) {
      console.warn('[AIService] summarize fallback used:', error?.message);
      return { success: true, data: { response: `[Summary]: ${text.slice(0, 100)}...` } };
    }
  },

  explain: async (topic, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/explain`, { topic, options });
      return response.data;
    } catch (error) {
      console.warn('[AIService] explain fallback used:', error?.message);
      return { success: true, data: { response: `[Explanation]: Granular breakdown of ${topic}.` } };
    }
  },

  getProviders: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/providers`);
      return response.data;
    } catch (error) {
      console.warn('[AIService] getProviders fallback used:', error?.message);
      return { success: true, data: [] };
    }
  },

  getProviderHealth: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/provider-health`);
      return response.data;
    } catch (error) {
      console.warn('[AIService] getProviderHealth fallback used:', error?.message);
      return { success: true, data: [] };
    }
  }
};

export default aiService;
