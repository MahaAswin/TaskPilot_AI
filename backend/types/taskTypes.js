// Task Agent Action & Level Tier Definitions

export const LEVEL_TIERS = {
  BEGINNER: 'Beginner',
  LEARNER: 'Learner',
  EXPLORER: 'Explorer',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXPERT: 'Expert',
  MASTER: 'Master',
  LEGEND: 'Legend'
};

export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const TASK_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

export const HABIT_CATEGORIES = {
  STUDY: 'Study Daily',
  DSA: 'Practice DSA',
  BOOKS: 'Read Books',
  EXERCISE: 'Exercise',
  MEDITATION: 'Meditation',
  CUSTOM: 'Custom Habits'
};

export default {
  LEVEL_TIERS,
  TASK_PRIORITIES,
  TASK_STATUSES,
  HABIT_CATEGORIES
};
