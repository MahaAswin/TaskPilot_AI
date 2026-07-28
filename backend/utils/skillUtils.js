// Skill Analyzer Agent Utilities

/**
 * Calculate overall rank string based on average skill score
 * @param {number} score 
 * @returns {string} Skill Rank Title
 */
export const calculateRankFromScore = (score) => {
  if (score < 40) return 'Beginner';
  if (score < 55) return 'Learner';
  if (score < 68) return 'Intermediate';
  if (score < 78) return 'Advanced';
  if (score < 85) return 'Expert';
  if (score < 90) return 'Master';
  if (score < 96) return 'Elite';
  return 'Legend';
};

/**
 * Format quiz accuracy percentage string
 * @param {number} correct 
 * @param {number} total 
 * @returns {string} Percentage
 */
export const formatQuizAccuracy = (correct, total) => {
  if (!total) return '0%';
  return `${Math.round((correct / total) * 100)}%`;
};

export default {
  calculateRankFromScore,
  formatQuizAccuracy
};
