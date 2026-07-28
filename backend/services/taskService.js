// Task Agent Service Layer (Boilerplate / Architecture Setup)

import { taskRepository } from '../repositories/taskRepository.js';
import { calculateXPForLevel, getLevelTitle } from '../utils/taskUtils.js';

export const taskService = {
  createTaskItem: async (data) => {
    return await taskRepository.create(data);
  },

  getAllTasks: async (query = {}) => {
    const list = await taskRepository.findAll(query);
    if (list.length === 0) {
      // Return high-fidelity pre-populated tasks for UI demonstration
      return [
        {
          _id: 't-1',
          title: 'Review Chapter 3: Dynamic Programming Arrays',
          description: 'Focus on 1D DP array tabulation and sliding window memory optimization.',
          category: 'Study Daily',
          priority: 'high',
          status: 'pending',
          estimatedTime: 45,
          xpReward: 25,
          dueDate: new Date().toISOString()
        },
        {
          _id: 't-2',
          title: 'Solve Monotonic Queue & Stack Problems',
          description: 'Complete 3 medium-level questions on LeetCode.',
          category: 'Practice DSA',
          priority: 'high',
          status: 'completed',
          estimatedTime: 60,
          xpReward: 30,
          dueDate: new Date().toISOString()
        },
        {
          _id: 't-3',
          title: 'Design System Scalability Flowchart',
          description: 'Draw LLD block diagram detailing rate limiters, token buckets, and cache invalidation.',
          category: 'Project',
          priority: 'medium',
          status: 'in_progress',
          estimatedTime: 90,
          xpReward: 40,
          dueDate: new Date().toISOString()
        }
      ];
    }
    return list;
  },

  completeTaskItem: async (id) => {
    const task = await taskRepository.findById(id);
    if (task) {
      task.status = 'completed';
      await taskRepository.update(id, task);
      return {
        success: true,
        xpAwarded: task.xpReward || 25,
        streakIncrement: 1,
        message: 'Task completed successfully!'
      };
    }
    return {
      success: true,
      xpAwarded: 25,
      streakIncrement: 1,
      message: 'Task completed successfully (Fallback Mode).'
    };
  },

  updateTaskItem: async (id, updateData) => {
    return await taskRepository.update(id, updateData);
  },

  deleteTaskItem: async (id) => {
    return await taskRepository.delete(id);
  },

  getAnalyticsReport: async (userId) => {
    return {
      completionRate: 75,
      weeklyProductivity: [
        { week: 'W1', score: 65 },
        { week: 'W2', score: 80 },
        { week: 'W3', score: 70 },
        { week: 'W4', score: 90 }
      ],
      categoryBreakdown: [
        { category: 'Study Daily', count: 12 },
        { category: 'Practice DSA', count: 18 },
        { category: 'Read Books', count: 5 },
        { category: 'Exercise', count: 8 },
        { category: 'Meditation', count: 6 }
      ],
      timeSpent: 350
    };
  },

  getAchievementsList: async (userId) => {
    return [
      { id: 'ach-1', title: 'First Task Completed', description: 'Crossed the starting line.', unlocked: true, unlockedAt: new Date(), xpReward: 50, icon: 'CheckSquare' },
      { id: 'ach-2', title: '7 Day Streak', description: 'Maintained a week-long streak of daily plans completed.', unlocked: true, unlockedAt: new Date(), xpReward: 100, icon: 'Flame' },
      { id: 'ach-3', title: '30 Day Streak', description: 'Dedicated consistency for 30 consecutive days.', unlocked: false, unlockedAt: null, xpReward: 250, icon: 'Award' },
      { id: 'ach-4', title: 'early bird', description: 'Completed a task before 8:00 AM.', unlocked: true, unlockedAt: new Date(), xpReward: 50, icon: 'Sun' },
      { id: 'ach-5', title: 'night owl', description: 'Finished a coding session past midnight.', unlocked: false, unlockedAt: null, xpReward: 50, icon: 'Moon' }
    ];
  },

  getXPMetrics: async (userId) => {
    return {
      currentXP: 450,
      nextLevel: 500,
      xpProgress: 90,
      currentLevel: 4,
      levelTitle: 'Explorer',
      history: [
        { action: 'Task Completed: Monotonic Queues', amount: 30, date: new Date() },
        { action: 'Quiz Completed: SQL Joins', amount: 40, date: new Date() },
        { action: 'Daily Habit: Exercise', amount: 20, date: new Date() },
        { action: 'Missed Deadline: Documentation', amount: -10, date: new Date() }
      ]
    };
  }
};

export default taskService;
