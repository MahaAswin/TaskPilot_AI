import linkSecurityAgent from '../agents/security/LinkSecurityAgent.js';
import websiteAnalysisAgent from '../agents/security/WebsiteAnalysisAgent.js';
import emailSecurityAgent from '../agents/security/EmailSecurityAgent.js';
import phoneIntelligenceAgent from '../agents/security/PhoneIntelligenceAgent.js';
import ApiError from '../utils/ApiError.js';

export class SecurityService {
  /**
   * Evaluates URL reputation via VirusTotal Link Security Agent.
   * @param {string} url - Validated and normalized URL
   * @param {object} [context={}] - Optional request context
   */
  async checkLink(url, context = {}) {
    try {
      return await linkSecurityAgent.execute(url, context);
    } catch (error) {
      console.error('[SecurityService] Error during link reputation check:', error);
      throw ApiError.internal(`Failed to complete VirusTotal link reputation scan: ${error.message}`);
    }
  }

  /**
   * Performs website behavioral analysis via urlscan.io Website Analysis Agent.
   * @param {string} url - Validated and normalized URL
   * @param {object} [context={}] - Optional request context
   */
  async analyzeWebsite(url, context = {}) {
    try {
      return await websiteAnalysisAgent.execute(url, context);
    } catch (error) {
      console.error('[SecurityService] Error during website behavioral analysis:', error);
      throw ApiError.internal(`Failed to complete urlscan.io website analysis: ${error.message}`);
    }
  }

  /**
   * Performs email reputation & deliverability verification via Email Security Agent.
   * @param {string} email - Email address to verify
   * @param {object} [context={}] - Optional request context
   */
  async checkEmail(email, context = {}) {
    try {
      return await emailSecurityAgent.execute(email, context);
    } catch (error) {
      console.error('[SecurityService] Error during email reputation check:', error);
      throw ApiError.internal(`Failed to complete Abstract Email reputation scan: ${error.message}`);
    }
  }

  /**
   * Performs phone number verification & carrier analysis via Phone Intelligence Agent.
   * @param {string} phone - Phone number to verify
   * @param {object} [context={}] - Optional request context
   */
  async checkPhone(phone, context = {}) {
    try {
      return await phoneIntelligenceAgent.execute(phone, context);
    } catch (error) {
      console.error('[SecurityService] Error during phone verification check:', error);
      throw ApiError.internal(`Failed to complete Abstract Phone verification scan: ${error.message}`);
    }
  }
}




export const securityService = new SecurityService();
export default securityService;
