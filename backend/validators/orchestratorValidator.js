// Orchestrator Input Validator

export const validateRunWorkflowInput = (data) => {
  const errors = [];
  if (!data.goal || typeof data.goal !== 'string') {
    errors.push('Goal string is required to trigger multi-agent pipeline');
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  validateRunWorkflowInput
};
