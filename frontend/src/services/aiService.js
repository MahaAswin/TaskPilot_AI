import axios from 'axios';

export const aiService = {
  generateQuiz: async (topic, options = {}) => {
    try {
      const res = await axios.post('/skills/analyze', { topic, ...options });
      return res.data;
    } catch (err) {
      console.warn('[aiService] generateQuiz fallback triggered');
      return null;
    }
  },

  generateRoadmap: async (prompt, options = {}) => {
    try {
      const res = await axios.post('/planning/roadmap', { prompt, ...options });
      return res.data;
    } catch (err) {
      console.warn('[aiService] generateRoadmap fallback triggered');
      return null;
    }
  },

  getProviders: async () => {
    return { data: [] };
  },

  getHealth: async () => {
    return { data: { status: 'active' } };
  }
};

export default aiService;
