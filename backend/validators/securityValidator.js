/**
 * Validates request data for link security checking and website analysis.
 * @param {object} data - Input payload containing url property
 * @returns {{ isValid: boolean, errors: string[], normalizedUrl?: string }}
 */
export const validateLinkCheckInput = (data) => {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: ['Request payload must be a JSON object containing a "url" property.']
    };
  }

  const { url } = data;

  if (!url || typeof url !== 'string' || url.trim() === '') {
    errors.push('The "url" parameter is required and must be a non-empty string.');
    return { isValid: false, errors };
  }

  let trimmedUrl = url.trim();

  // Auto-prefix http:// if user omitted protocol scheme
  if (!/^https?:\/\//i.test(trimmedUrl)) {
    trimmedUrl = `http://${trimmedUrl}`;
  }

  try {
    const parsedUrl = new URL(trimmedUrl);

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      errors.push('URL protocol must be HTTP or HTTPS.');
    }

    if (!parsedUrl.hostname || parsedUrl.hostname.includes(' ')) {
      errors.push('Invalid domain hostname in URL.');
    }
  } catch (err) {
    errors.push('Invalid URL format. Please provide a valid web URL (e.g., https://example.com).');
  }

  return {
    isValid: errors.length === 0,
    errors,
    normalizedUrl: trimmedUrl
  };
};

/**
 * Validates email input payload for Email Security Agent.
 * @param {object} data 
 */
export const validateEmailCheckInput = (data) => {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: ['Request payload must be a JSON object containing an "email" property.']
    };
  }

  const email = data.email || data.emailAddress || '';

  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push('The "email" parameter is required and must be a non-empty string.');
    return { isValid: false, errors };
  }

  const trimmedEmail = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) {
    errors.push('Invalid email format. Please enter a valid email address (e.g., example@gmail.com).');
  }

  return {
    isValid: errors.length === 0,
    errors,
    email: trimmedEmail
  };
};

/**
 * Validates phone input payload for Phone Intelligence Agent.
 * @param {object} data 
 */
export const validatePhoneCheckInput = (data) => {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: ['Request payload must be a JSON object containing a "phone" property.']
    };
  }

  const phone = data.phone || data.phoneNumber || '';

  if (!phone || typeof phone !== 'string' || phone.trim() === '') {
    errors.push('The "phone" parameter is required and must be a non-empty string.');
    return { isValid: false, errors };
  }

  const trimmedPhone = phone.trim();
  const digitsOnly = trimmedPhone.replace(/[^\d]/g, '');

  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    errors.push('Invalid phone number format. Please enter a valid international phone number with digits (e.g., +919876543210).');
  }

  return {
    isValid: errors.length === 0,
    errors,
    phone: trimmedPhone
  };
};

export default {
  validateLinkCheckInput,
  validateEmailCheckInput,
  validatePhoneCheckInput
};



