/**
 * Validates request payload for email generation.
 * @param {object} data 
 */
export const validateEmailGenerateInput = (data) => {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: ['Request payload must be a JSON object containing a "prompt" property.']
    };
  }

  const prompt = (data.prompt || data.text || '').trim();
  const existingBody = (data.existingBody || '').trim();

  if (!prompt && !existingBody) {
    errors.push('The "prompt" parameter is required (e.g., "Write an internship request email.").');
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      prompt,
      tone: data.tone || 'Professional',
      action: data.action || 'generate',
      existingSubject: data.existingSubject || '',
      existingBody
    }
  };
};

/**
 * Validates request payload for email transmission.
 * @param {object} data 
 */
export const validateEmailSendInput = (data) => {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: ['Request payload must be a JSON object.']
    };
  }

  const to = (data.to || data.recipient || '').trim();
  const subject = (data.subject || '').trim();
  const body = (data.body || data.content || '').trim();

  if (!to) {
    errors.push('Recipient email address ("to") is required.');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      errors.push('Invalid recipient email address format (e.g., hr@company.com).');
    }
  }

  if (!subject) {
    errors.push('Email subject line is required.');
  }

  if (!body) {
    errors.push('Email body content is required.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      to,
      subject,
      body,
      attachments: Array.isArray(data.attachments) ? data.attachments : []
    }
  };
};

export default {
  validateEmailGenerateInput,
  validateEmailSendInput
};
