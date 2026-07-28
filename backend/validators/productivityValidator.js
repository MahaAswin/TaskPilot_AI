// Productivity Validator Rules

export const validateFocusSessionInput = (data) => {
  const errors = [];
  if (data.durationMinutes && data.durationMinutes <= 0) {
    errors.push('Focus session duration must be greater than 0');
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  validateFocusSessionInput
};
