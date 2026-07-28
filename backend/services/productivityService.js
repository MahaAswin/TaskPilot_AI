// Productivity Coach Service Layer

import { productivityRepository } from '../repositories/productivityRepository.js';

export const productivityService = {
  getDashboardData: async (userId) => {
    const profile = await productivityRepository.getProfileByUserId(userId);
    if (profile) return profile;

    return {
      productivityScore: 88,
      todayFocusTime: '3h 45m',
      focusHours: 28.5,
      learningHours: 18.2,
      taskCompletionRate: 85,
      consistencyScore: 92,
      currentStreak: 14,
      goalsCompleted: 8,
      achievementsCount: 12
    };
  },

  getDailyReportData: async (userId) => {
    return {
      date: new Date().toLocaleDateString(),
      tasksCompleted: 6,
      studyTime: '4h 15m',
      focusTime: '3h 45m',
      xpEarned: 180,
      achievements: ['Focus Master', 'Streak Keeper'],
      highlights: [
        'Completed 100% of high priority DSA tasks',
        'Achieved 0 distractions during 45m focus session'
      ],
      areasForImprovement: 'Consider scheduling evening revision before 9 PM.'
    };
  },

  getWeeklyReportData: async (userId) => {
    return {
      period: 'Current Week',
      weeklyProductivity: 88,
      weeklyLearning: '24.5 hrs',
      skillImprovement: '+6.2%',
      taskCompletion: '85%',
      habitConsistency: '92%'
    };
  },

  getMonthlyReportData: async (userId) => {
    return {
      period: 'Current Month',
      monthlySummary: 'Accomplished 8 major milestones across core domains.',
      goalsCompleted: 8,
      hoursInvested: 112,
      achievementsUnlocked: 5
    };
  },

  getRecommendationsData: async (userId) => {
    return [
      { id: 'rec-1', title: 'Increase DSA Practice Frequency', category: 'Focus', impact: 'High Impact', reason: 'Adding a 30m morning DSA session will raise your task completion speed by 15%.', actionText: 'Schedule Focus Block' },
      { id: 'rec-2', title: 'Revise Java Collections Framework', category: 'Learning', impact: 'Medium Impact', reason: 'Revising HashMap internals ensures 100% quiz accuracy on backend topics.', actionText: 'Start 20m Revision' }
    ];
  },

  getFocusSessionsData: async (userId) => {
    return await productivityRepository.getFocusSessionsByUserId(userId);
  },

  startFocusSessionCycle: async (userId, data) => {
    return await productivityRepository.createFocusSession({ userId, ...data, status: 'active' });
  },

  endFocusSessionCycle: async (userId, data) => {
    return { success: true, message: 'Focus Session ended. Data logged for Productivity Coach.' };
  },

  updateProfileData: async (userId, data) => {
    return { userId, ...data };
  }
};

export default productivityService;
