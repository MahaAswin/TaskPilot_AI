// Task Input Schema Validation Placeholders

export const validateTaskInput = (data) => {
  const errors = [];
  if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
    errors.push('Task title is required and must be a valid string');
  }
  if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
    errors.push('Priority must be low, medium, or high');
  }
  if (data.status && !['pending', 'in_progress', 'completed'].includes(data.status)) {
    errors.push('Status must be pending, in_progress, or completed');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateHabitInput = (data) => {
  const errors = [];
  if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
    errors.push('Habit title is required and must be a valid string');
  }
  if (data.frequency && !['daily', 'weekly', 'custom'].includes(data.frequency)) {
    errors.push('Frequency must be daily, weekly, or custom');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  validateTaskInput,
  validateHabitInput
};
