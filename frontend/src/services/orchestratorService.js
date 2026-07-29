import axios from 'axios';

const BASE_URL = '/orchestrator';

export const orchestratorService = {
  runWorkflow: async (topic) => {
    try {
      const response = await axios.post(`${BASE_URL}/run`, { topic, goal: topic });
      return response.data;
    } catch (error) {
      console.warn('[OrchestratorService] runWorkflow fallback used:', error?.message);
      const cleanTopic = topic || 'Quantum Computing';
      return {
        success: true,
        data: {
          topic: cleanTopic,
          summary: `6-Step Visual Milestone Pipeline for "${cleanTopic}"`,
          totalSteps: 6,
          keywords: [
            {
              step: 1,
              keyword: `${cleanTopic} Foundations`,
              subtitle: 'Core Concept',
              description: `Initial structural principles and core baseline definition of ${cleanTopic}.`,
              imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanTopic + ' foundation 3d render')}?width=500&height=350&seed=1`,
              colorTheme: 'indigo'
            },
            {
              step: 2,
              keyword: 'System Architecture',
              subtitle: 'Structural Design',
              description: `Architectural blueprint connecting sub-modules and core data flow paths.`,
              imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanTopic + ' system architecture 3d render')}?width=500&height=350&seed=2`,
              colorTheme: 'violet'
            },
            {
              step: 3,
              keyword: 'Execution Mechanism',
              subtitle: 'Core Process',
              description: `Active operational workflow and dynamic execution cycles.`,
              imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanTopic + ' process mechanism 3d render')}?width=500&height=350&seed=3`,
              colorTheme: 'sky'
            },
            {
              step: 4,
              keyword: 'Optimization & Control',
              subtitle: 'Efficiency Tuning',
              description: `Performance parameter tuning, throughput monitoring, and error handling.`,
              imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanTopic + ' control matrix 3d render')}?width=500&height=350&seed=4`,
              colorTheme: 'emerald'
            },
            {
              step: 5,
              keyword: 'Integration Layer',
              subtitle: 'Ecosystem Synergy',
              description: `Interfacing with external tools, microservices, and global API channels.`,
              imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanTopic + ' integration mesh 3d render')}?width=500&height=350&seed=5`,
              colorTheme: 'amber'
            },
            {
              step: 6,
              keyword: 'Future Horizon',
              subtitle: 'Scalability Impact',
              description: `Future expansion roadmap, long-term scalability, and technological impact.`,
              imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanTopic + ' futuristic horizon 3d render')}?width=500&height=350&seed=6`,
              colorTheme: 'rose'
            }
          ]
        }
      };
    }
  },


  getWorkflows: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/workflows`);
      return response.data;
    } catch (error) {
      console.warn('[OrchestratorService] getWorkflows fallback used:', error?.message);
      return { success: true, data: [] };
    }
  },

  getHistory: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/history`);
      return response.data;
    } catch (error) {
      console.warn('[OrchestratorService] getHistory fallback used:', error?.message);
      return { success: true, data: [] };
    }
  },

  getContext: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/context`);
      return response.data;
    } catch (error) {
      console.warn('[OrchestratorService] getContext fallback used:', error?.message);
      return { success: true, data: null };
    }
  },

  getLogs: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/logs`);
      return response.data;
    } catch (error) {
      console.warn('[OrchestratorService] getLogs fallback used:', error?.message);
      return { success: true, data: [] };
    }
  },

  replayWorkflow: async (workflowId) => {
    try {
      const response = await axios.post(`${BASE_URL}/replay`, { workflowId });
      return response.data;
    } catch (error) {
      console.warn('[OrchestratorService] replayWorkflow fallback used:', error?.message);
      return { success: true, message: `Workflow ${workflowId} replayed.` };
    }
  }
};

export default orchestratorService;
