import axios from 'axios';
import BaseSecurityProvider from './BaseSecurityProvider.js';

export class GoogleSafeBrowsingProvider extends BaseSecurityProvider {
  constructor(config = {}) {
    super({ name: 'Google Safe Browsing', timeout: config.timeout || 5000 });
    this.apiKey = config.apiKey ||
      process.env.SAFE_BROWSING_API_KEY ||
      process.env.GOOGLE_SAFE_BROWSING_API_KEY ||
      process.env.GEMINI_API_KEY ||
      '';
    this.endpoint = 'https://safebrowsing.googleapis.com/v4/threatMatches:find';
  }

  /**
   * Evaluates URL safety via Google Safe Browsing API v4.
   * @param {string} url 
   * @returns {Promise<{ status: string, risk: string, threats: string[], rawDetails?: object, providerName: string, error?: string }>}
   */
  async checkUrl(url) {
    if (!this.apiKey) {
      return {
        status: 'UNKNOWN',
        risk: 'MEDIUM',
        threats: [],
        providerName: this.name,
        error: 'Google Safe Browsing API key is not configured.'
      };
    }

    const payload = {
      client: {
        clientId: 'taskpilot-ai',
        clientVersion: '1.0.0'
      },
      threatInfo: {
        threatTypes: [
          'MALWARE',
          'SOCIAL_ENGINEERING',
          'UNWANTED_SOFTWARE',
          'POTENTIALLY_HARMFUL_APPLICATION',
          'THREAT_TYPE_UNSPECIFIED'
        ],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url }]
      }
    };

    try {
      const response = await axios.post(`${this.endpoint}?key=${this.apiKey}`, payload, {
        timeout: this.timeout,
        headers: { 'Content-Type': 'application/json' }
      });

      const matches = response.data?.matches || [];
      if (matches.length === 0) {
        return {
          status: 'SAFE',
          risk: 'LOW',
          threats: [],
          providerName: this.name,
          rawDetails: response.data
        };
      }

      // Map found matches to threat categories
      const threatSet = new Set();
      matches.forEach((match) => {
        if (match.threatType) {
          threatSet.add(match.threatType);
        }
      });
      const threats = Array.from(threatSet);

      // Determine risk level based on threat types
      const isCritical = threats.some(t => t === 'MALWARE' || t === 'SOCIAL_ENGINEERING');
      const risk = isCritical ? 'HIGH' : 'MEDIUM';

      return {
        status: 'UNSAFE',
        risk,
        threats,
        providerName: this.name,
        rawDetails: matches
      };

    } catch (error) {
      console.warn(`[GoogleSafeBrowsingProvider] API request error: ${error.message}`);
      return {
        status: 'UNKNOWN',
        risk: 'MEDIUM',
        threats: [],
        providerName: this.name,
        error: error.response?.data?.error?.message || error.message || 'API request failed'
      };
    }
  }
}

export default GoogleSafeBrowsingProvider;
