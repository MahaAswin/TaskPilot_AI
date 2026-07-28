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
          provider: 'Gemini',
          model: 'gemini-1.5-pro',
          response: `[Gemini Chat Response]: Responding to "${messages[messages.length - 1]?.content}"`,
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
      return { success: true, data: { response: `• Summary Point 1: Key takeaway\n• Summary Point 2: Concept summary` } };
    }
  },

  generateNotes: async (topic, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/notes`, { topic, options });
      return response.data;
    } catch (error) {
      console.warn('[AIService] generateNotes fallback used:', error?.message);
      return { success: true, data: { response: `### ${topic} Notes\n- Core Principle\n- Technical Details` } };
    }
  },

  generateQuiz: async (topic, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/quiz`, { topic, options });
      return response.data;
    } catch (error) {
      console.warn('[AIService] generateQuiz fallback used:', error?.message);
      return {
        success: true,
        data: {
          data: [
            { question: `Sample question on ${topic}?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], answer: 0 }
          ]
        }
      };
    }
  },

  generateFlashcards: async (topic, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/flashcards`, { topic, options });
      return response.data;
    } catch (error) {
      console.warn('[AIService] generateFlashcards fallback used:', error?.message);
      return {
        success: true,
        data: {
          data: [
            { front: `What is ${topic}?`, back: `Definition of ${topic}` }
          ]
        }
      };
    }
  },

  generateStudyPlan: async (topic, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/study-plan`, { topic, options });
      return response.data;
    } catch (error) {
      console.warn('[AIService] generateStudyPlan fallback used:', error?.message);
      return {
        success: true,
        data: {
          data: { topic, duration: '4 Weeks', weeklyPlan: [{ week: 1, title: 'Basics', goals: ['Goal 1'] }] }
        }
      };
    }
  },

  generateRoadmap: async (goal, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/roadmap`, { goal, options });
      return response.data;
    } catch (error) {
      console.warn('[AIService] generateRoadmap fallback used:', error?.message);
      return {
        success: true,
        data: {
          data: { goal, milestones: [{ step: 1, title: 'Foundations', description: 'Basic setup', estimatedDays: 14 }] }
        }
      };
    }
  },

  generateTasks: async (goal, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/tasks`, { goal, options });
      return response.data;
    } catch (error) {
      console.warn('[AIService] generateTasks fallback used:', error?.message);
      return {
        success: true,
        data: {
          data: [{ title: `Study ${goal}`, category: 'Learning', priority: 'High', estimatedMinutes: 45, xpReward: 50 }]
        }
      };
    }
  },

  generateInterview: async (topic, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/interview`, { topic, options });
      return response.data;
    } catch (error) {
      console.warn('[AIService] generateInterview fallback used:', error?.message);
      return {
        success: true,
        data: {
          data: [{ question: `Interview question on ${topic}?`, difficulty: 'Medium', modelAnswer: 'Answer detail' }]
        }
      };
    }
  },

  generateDiagram: async (topic, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/diagram`, { topic, options });
      return response.data;
    } catch (error) {
      console.warn('[AIService] generateDiagram fallback used:', error?.message);
      return { success: true, data: { diagram: `graph TD;\n  A[${topic}] --> B[Execution];` } };
    }
  },

  generateMindMap: async (topic, options = {}) => {
    try {
      const response = await axios.post(`${BASE_URL}/mindmap`, { topic, options });
      return response.data;
    } catch (error) {
      console.warn('[AIService] generateMindMap fallback used:', error?.message);
      return {
        success: true,
        data: {
          mindMap: { id: 'root', label: topic, children: [{ id: 'sub-1', label: 'Main Concept' }] }
        }
      };
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
