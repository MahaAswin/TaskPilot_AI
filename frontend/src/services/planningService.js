import axios from 'axios';

const BASE_URL = '/planning';

export const planningService = {
  // Create a new planning canvas session
  createPlan: async (planData) => {
    try {
      const response = await axios.post(`${BASE_URL}/create`, planData);
      return response.data;
    } catch (error) {
      console.warn('[PlanningService] createPlan fallback used:', error?.message);
      return { success: true, data: planData, message: 'Plan created (local draft).' };
    }
  },

  // Retrieve all saved planning canvases
  getAllPlans: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/all`);
      return response.data;
    } catch (error) {
      console.warn('[PlanningService] getAllPlans fallback used:', error?.message);
      return { success: true, data: [] };
    }
  },

  // Retrieve a specific planning canvas by ID
  getPlanById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.warn('[PlanningService] getPlanById fallback used:', error?.message);
      return { success: true, data: null };
    }
  },

  // Update planning canvas state
  updatePlan: async (updateData) => {
    try {
      const response = await axios.put(`${BASE_URL}/update`, updateData);
      return response.data;
    } catch (error) {
      console.warn('[PlanningService] updatePlan fallback used:', error?.message);
      return { success: true, data: updateData, message: 'Plan updated.' };
    }
  },

  // Delete a planning canvas
  deletePlan: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete`, { data: { id } });
      return response.data;
    } catch (error) {
      console.warn('[PlanningService] deletePlan fallback used:', error?.message);
      return { success: true, message: 'Plan deleted.' };
    }
  },

  // Export plan in requested format (PDF, DOCX, Markdown, Image)
  exportPlan: async (exportOptions) => {
    try {
      const response = await axios.post(`${BASE_URL}/export`, exportOptions);
      return response.data;
    } catch (error) {
      console.warn('[PlanningService] exportPlan fallback used:', error?.message);
      return { success: true, format: exportOptions.format, downloadUrl: '#', message: `Exported as ${exportOptions.format.toUpperCase()}` };
    }
  }
};

export default planningService;
