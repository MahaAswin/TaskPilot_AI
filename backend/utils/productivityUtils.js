// Productivity Coach Utilities

export const formatDurationString = (minutes) => {
  if (!minutes) return '0m';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
};

export const calculateProductivityScore = (completed, total, focusMins) => {
  if (!total) return 80;
  const taskRate = (completed / total) * 60;
  const timeBonus = Math.min(40, (focusMins / 120) * 40);
  return Math.round(taskRate + timeBonus);
};

export default {
  formatDurationString,
  calculateProductivityScore
};
