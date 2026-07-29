import VirusTotalProvider from './VirusTotalProvider.js';
import UrlscanProvider from './UrlscanProvider.js';
import EmailSecurityProvider from './EmailSecurityProvider.js';
import AbstractEmailProvider from './AbstractEmailProvider.js';
import AbstractPhoneProvider from './AbstractPhoneProvider.js';

export class SecurityProviderRegistry {
  constructor() {
    this.providers = new Map();
    // Register default security providers
    this.register('virustotal', new VirusTotalProvider());
    this.register('urlscan', new UrlscanProvider());
    this.register('email', new EmailSecurityProvider());
    this.register('abstract_email', new AbstractEmailProvider());
    this.register('abstract_phone', new AbstractPhoneProvider());
  }




  /**
   * Register a new security provider implementation.
   * Enables modular addition of new providers (EmailSpam, FileMalware, QRCode, TrustAnalyzer).
   * @param {string} key - Unique provider identifier
   * @param {BaseSecurityProvider} providerInstance - Concrete provider instance
   */
  register(key, providerInstance) {
    if (!key || typeof key !== 'string') {
      throw new Error('Provider key must be a non-empty string');
    }
    this.providers.set(key.toLowerCase(), providerInstance);
  }

  /**
   * Get provider instance by key.
   * @param {string} key 
   * @returns {BaseSecurityProvider|undefined}
   */
  get(key) {
    return this.providers.get(key.toLowerCase());
  }

  /**
   * Get all registered security providers.
   * @returns {BaseSecurityProvider[]}
   */
  getAll() {
    return Array.from(this.providers.values());
  }

  /**
   * Scans link URL reputation via VirusTotal provider.
   * @param {string} url 
   */
  async checkLinkReputation(url) {
    const provider = this.get('virustotal');
    if (!provider) {
      throw new Error('VirusTotal provider not registered');
    }
    return await provider.checkUrl(url);
  }

  /**
   * Performs behavioral website analysis via urlscan.io provider.
   * @param {string} url 
   */
  async analyzeWebsiteBehavior(url) {
    const provider = this.get('urlscan');
    if (!provider) {
      throw new Error('urlscan.io provider not registered');
    }
    return await provider.analyzeWebsite(url);
  }

  /**
   * Analyzes email content for spam and phishing threats via EmailSecurityProvider.
   * @param {{ subject?: string, sender?: string, body: string }} emailData 
   */
  async checkEmailContent(emailData) {
    const provider = this.get('email');
    if (!provider) {
      throw new Error('EmailSecurityProvider not registered');
    }
    return await provider.checkEmail(emailData);
  }

  /**
   * Verifies email reputation & deliverability via AbstractEmailProvider.
   * @param {string} email 
   */
  async checkEmailReputation(email) {
    const provider = this.get('abstract_email');
    if (!provider) {
      throw new Error('AbstractEmailProvider not registered');
    }
    return await provider.checkEmailReputation(email);
  }

  /**
   * Verifies and analyzes phone number via AbstractPhoneProvider.
   * @param {string} phone 
   */
  async checkPhoneReputation(phone) {
    const provider = this.get('abstract_phone');
    if (!provider) {
      throw new Error('AbstractPhoneProvider not registered');
    }
    return await provider.checkPhone(phone);
  }
}




export const securityProviderRegistry = new SecurityProviderRegistry();
export default securityProviderRegistry;
