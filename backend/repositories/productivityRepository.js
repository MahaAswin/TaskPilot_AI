// Productivity Repository Layer

import { ProductivityProfile } from '../models/ProductivityProfile.js';
import { FocusSession } from '../models/FocusSession.js';

export const productivityRepository = {
  getProfileByUserId: async (userId) => {
    try {
      return await ProductivityProfile.findOne({ userId });
    } catch {
      return null;
    }
  },

  getFocusSessionsByUserId: async (userId) => {
    try {
      return await FocusSession.find({ userId }).sort({ createdAt: -1 });
    } catch {
      return [];
    }
  },

  createFocusSession: async (sessionData) => {
    try {
      return await FocusSession.create(sessionData);
    } catch {
      return { id: `fs_${Date.now()}`, ...sessionData };
    }
  }
};

export default productivityRepository;
