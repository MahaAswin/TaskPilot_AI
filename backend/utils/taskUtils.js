// Task Agent Utility Functions (XP Calculations & Spaced Streaks)

/**
 * Calculate XP required for a given level tier
 * @param {number} level 
 * @returns {number} Required XP
 */
export const calculateXPForLevel = (level) => {
  // Level 1: 100XP, Level 2: 200XP, Level 3: 350XP, etc.
  if (level <= 1) return 100;
  return Math.round(100 * Math.pow(1.5, level - 1));
};

/**
 * Determine the tier title based on current level index
 * @param {number} level 
 * @returns {string} Tier Level Title
 */
export const getLevelTitle = (level) => {
  if (level < 3) return 'Beginner';
  if (level < 6) return 'Learner';
  if (level < 10) return 'Explorer';
  if (level < 15) return 'Intermediate';
  if (level < 20) return 'Advanced';
  if (level < 25) return 'Expert';
  if (level < 30) return 'Master';
  return 'Legend';
};

/**
 * Format task duration string to standard numbers
 * @param {number} durationInMin 
 * @returns {string} Formatted duration string
 */
export const formatDuration = (durationInMin) => {
  if (!durationInMin) return '0m';
  const hrs = Math.floor(durationInMin / 60);
  const mins = durationInMin % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
};

export default {
  calculateXPForLevel,
  getLevelTitle,
  formatDuration
};
