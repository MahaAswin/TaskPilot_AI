/**
 * Abstract Base Security Provider Interface.
 * Standardizes the contract for security scanning & behavioral analysis providers.
 */
export class BaseSecurityProvider {
  constructor(config = {}) {
    if (new.target === BaseSecurityProvider) {
      throw new TypeError('Cannot construct BaseSecurityProvider instances directly');
    }
    this.name = config.name || 'BaseSecurityProvider';
    this.timeout = config.timeout || 10000;
  }

  /**
   * Analyzes a URL reputation and returns standard security findings.
   * @param {string} url - Target URL to inspect
   * @returns {Promise<{ status: string, risk: string, threats: string[], rawDetails?: object, providerName: string }>}
   */
  async checkUrl(url) {
    throw new Error(`checkUrl(url) must be implemented by ${this.constructor.name}`);
  }

  /**
   * Performs website behavioral analysis (redirect chains, scripts, network requests, SSL, metadata).
   * @param {string} url - Target URL to inspect
   * @returns {Promise<object>}
   */
  async analyzeWebsite(url) {
    throw new Error(`analyzeWebsite(url) must be implemented by ${this.constructor.name}`);
  }
}

export default BaseSecurityProvider;
