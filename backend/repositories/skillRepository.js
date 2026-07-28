// Skill Repository Layer (Database abstraction & fallback)

import { SkillProfile } from '../models/SkillProfile.js';
import { SkillCategory } from '../models/SkillCategory.js';
import { TopicProgress } from '../models/TopicProgress.js';
import { PerformanceReport } from '../models/PerformanceReport.js';

export const skillRepository = {
  getProfileByUserId: async (userId) => {
    try {
      const profile = await SkillProfile.findOne({ userId });
      return profile || null;
    } catch (error) {
      return null;
    }
  },

  getCategoriesByProfileId: async (profileId) => {
    try {
      return await SkillCategory.find({ profileId });
    } catch (error) {
      return [];
    }
  },

  updateProfile: async (userId, updateData) => {
    try {
      return await SkillProfile.findOneAndUpdate({ userId }, updateData, { new: true, upsert: true });
    } catch (error) {
      return { userId, ...updateData };
    }
  }
};

export default skillRepository;
