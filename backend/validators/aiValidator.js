// AI Request Validator

export const validateAIGenerateInput = (data) => {
  const errors = [];
  if (!data.prompt && !data.topic && !data.text && !data.messages) {
    errors.push('Input prompt or conversation messages are required');
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  validateAIGenerateInput
};
