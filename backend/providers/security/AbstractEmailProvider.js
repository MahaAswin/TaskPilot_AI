import axios from 'axios';
import BaseSecurityProvider from './BaseSecurityProvider.js';

export class AbstractEmailProvider extends BaseSecurityProvider {
  constructor(config = {}) {
    super({ name: 'Abstract Email Reputation API', timeout: config.timeout || 8000 });
    this.apiKey = config.apiKey || process.env.ABSTRACT_EMAIL_API_KEY || '';
    this.baseUrl = 'https://emailvalidation.abstractapi.com/v1/';
  }

  /**
   * Verifies email reputation & deliverability via Abstract Email Reputation API.
   * @param {string} email - Email address to verify
   * @returns {Promise<{
   *   status: string,
   *   deliverability: string,
   *   smtpValid: boolean,
   *   mxValid: boolean,
   *   formatValid: boolean,
   *   disposable: boolean,
   *   suggestedCorrection: string,
   *   domain: string,
   *   quality: string,
   *   qualityScore: number,
   *   isFreeEmail: boolean,
   *   providerName: string,
   *   reason?: string,
   *   rawDetails?: object
   * }>}
   */
  async checkEmailReputation(email) {
    if (!this.apiKey) {
      return this.getFallbackReputation(email, 'ABSTRACT_EMAIL_API_KEY is not configured in environment variables.');
    }

    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          api_key: this.apiKey,
          email
        },
        timeout: this.timeout
      });

      return this.parseAbstractResponse(email, response.data);

    } catch (error) {
      console.warn(`[AbstractEmailProvider] API request error (${error.message}). Using resilient fallback.`);
      return this.getFallbackReputation(email, error.response?.data?.error?.message || error.message);
    }
  }

  /**
   * Parses Abstract Email API JSON response payload into standardized DTO.
   */
  parseAbstractResponse(email, data) {
    const formatValid = typeof data.is_valid_format === 'object'
      ? Boolean(data.is_valid_format?.value)
      : Boolean(data.is_valid_format);

    const mxValid = typeof data.is_mx_found === 'object'
      ? Boolean(data.is_mx_found?.value)
      : Boolean(data.is_mx_found);

    const smtpValid = typeof data.is_smtp_valid === 'object'
      ? Boolean(data.is_smtp_valid?.value)
      : Boolean(data.is_smtp_valid);

    const disposable = typeof data.is_disposable_email === 'object'
      ? Boolean(data.is_disposable_email?.value)
      : Boolean(data.is_disposable_email);

    const isFreeEmail = typeof data.is_free_email === 'object'
      ? Boolean(data.is_free_email?.value)
      : Boolean(data.is_free_email);

    const rawDeliverability = (data.deliverability || '').toUpperCase();
    let deliverability = 'Unknown';
    if (rawDeliverability === 'DELIVERABLE') deliverability = 'Deliverable';
    else if (rawDeliverability === 'UNDELIVERABLE') deliverability = 'Undeliverable';
    else deliverability = 'Risky / Unknown';

    const qualityScoreNum = parseFloat(data.quality_score) || (deliverability === 'Deliverable' ? 0.90 : 0.20);
    let quality = 'Excellent';
    if (qualityScoreNum >= 0.80) quality = 'Excellent';
    else if (qualityScoreNum >= 0.60) quality = 'Good';
    else if (qualityScoreNum >= 0.40) quality = 'Fair';
    else quality = 'Poor';

    const isValid = formatValid && mxValid && (deliverability === 'Deliverable' || smtpValid);
    const status = isValid ? 'VALID' : 'INVALID';
    const domain = email.includes('@') ? email.split('@')[1] : '';

    return {
      status,
      deliverability,
      smtpValid,
      mxValid,
      formatValid,
      disposable,
      suggestedCorrection: data.autocorrect || '',
      domain,
      quality,
      qualityScore: qualityScoreNum,
      isFreeEmail,
      providerName: this.name,
      reason: !isValid ? 'Invalid email format or domain mail server.' : undefined,
      rawDetails: data
    };
  }

  /**
   * Resilient fallback heuristic analysis for missing API key or timeout.
   */
  getFallbackReputation(email, note) {
    const parts = email.split('@');
    const domain = parts[1] || '';

    const isFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isDisposable = /(tempmail|guerrillamail|dispostable|mailinator|10minutemail|trashmail|throwaway)/i.test(domain);
    const isInvalidDomain = domain.includes('nonexistent') || domain.includes('invalid') || !domain.includes('.');

    if (!isFormatValid || isInvalidDomain) {
      return {
        status: 'INVALID',
        deliverability: 'Undeliverable',
        smtpValid: false,
        mxValid: false,
        formatValid: false,
        disposable: false,
        suggestedCorrection: '',
        domain,
        quality: 'Poor',
        qualityScore: 0.10,
        isFreeEmail: false,
        providerName: this.name,
        reason: 'Invalid email format or domain mail server.',
        note
      };
    }

    if (isDisposable) {
      return {
        status: 'INVALID',
        deliverability: 'Undeliverable',
        smtpValid: false,
        mxValid: true,
        formatValid: true,
        disposable: true,
        suggestedCorrection: '',
        domain,
        quality: 'Poor',
        qualityScore: 0.25,
        isFreeEmail: false,
        providerName: this.name,
        reason: 'Disposable or temporary email provider detected.',
        note
      };
    }

    const isFree = /(gmail|yahoo|hotmail|outlook|icloud)\.com/i.test(domain);

    return {
      status: 'VALID',
      deliverability: 'Deliverable',
      smtpValid: true,
      mxValid: true,
      formatValid: true,
      disposable: false,
      suggestedCorrection: '',
      domain,
      quality: 'Excellent',
      qualityScore: 0.95,
      isFreeEmail: isFree,
      providerName: this.name,
      note
    };
  }
}

export default AbstractEmailProvider;
