// Skill Input Validator Scaffolding

export const validateSkillProfileInput = (data) => {
  const errors = [];
  if (data.overallScore && (data.overallScore < 0 || data.overallScore > 100)) {
    errors.push('Overall score must be between 0 and 100');
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  validateSkillProfileInput
};
