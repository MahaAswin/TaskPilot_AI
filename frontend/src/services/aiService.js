import axios from 'axios';

const BASE_URL = '/ai';

export const aiService = {
  chat: async (messages, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/chat`, { messages, options });
      return response.data;
    } catch (error) {
      console.error('[AIService Error] chat failed:', error?.message);
      throw error;
    }
  },

  summarize: async (text, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/summarize`, { text, options });
      return response.data;
    } catch (error) {
      console.error('[AIService Error] summarize failed:', error?.message);
      throw error;
    }
  },

  generateNotes: async (topic, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/notes`, { topic, options });
      return response.data;
    } catch (error) {
      console.error('[AIService Error] generateNotes failed:', error?.message);
      throw error;
    }
  },

  generateQuiz: async (topic, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/quiz`, { topic, options });
      return response.data;
    } catch (error) {
      console.error('[AIService Error] generateQuiz failed:', error?.message);
      throw error;
    }
  },

  generateFlashcards: async (topic, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/flashcards`, { topic, options });
      return response.data;
    } catch (error) {
      console.error('[AIService Error] generateFlashcards failed:', error?.message);
      throw error;
    }
  },

  generateStudyPlan: async (topic, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/study-plan`, { topic, options });
      return response.data;
    } catch (error) {
      console.error('[AIService Error] generateStudyPlan failed:', error?.message);
      throw error;
    }
  },

  generateRoadmap: async (goal, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/roadmap`, { goal, options });
      return response.data;
    } catch (error) {
      console.error('[AIService Error] generateRoadmap failed:', error?.message);
      throw error;
    }
  },

  generateTasks: async (goal, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/tasks`, { goal, options });
      return response.data;
    } catch (error) {
      console.error('[AIService Error] generateTasks failed:', error?.message);
      throw error;
    }
  },

  generateInterview: async (topic, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/interview`, { topic, options });
      return response.data;
    } catch (error) {
      console.error('[AIService Error] generateInterview failed:', error?.message);
      throw error;
    }
  },

  generateDiagram: async (topic, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/diagram`, { topic, options });
      return response.data;
    } catch (error) {
      console.error('[AIService Error] generateDiagram failed:', error?.message);
      throw error;
    }
  },

  generateMindMap: async (topic, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/mindmap`, { topic, options });
      return response.data;
    } catch (error) {
      console.error('[AIService Error] generateMindMap failed:', error?.message);
      throw error;
    }
  },

  getProviders: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/providers`);
      return response.data;
    } catch (error) {
      console.error('[AIService Error] getProviders failed:', error?.message);
      throw error;
    }
  },

  getProviderHealth: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/provider-health`);
      return response.data;
    } catch (error) {
      console.error('[AIService Error] getProviderHealth failed:', error?.message);
      throw error;
    }
  }
};

export default aiService;
