import emailAgent from '../agents/email/EmailAgent.js';
import gmailClient from '../providers/email/GmailClient.js';
import ApiError from '../utils/ApiError.js';

export class EmailService {
  /**
   * Generates Google OAuth authorization URL.
   * @param {string} [state] 
   */
  getGoogleAuthUrl(state = '') {
    return gmailClient.getAuthorizationUrl(state);
  }

  /**
   * Handles Google OAuth redirect callback code.
   * @param {string} code 
   * @param {string} [userId] 
   */
  async handleGoogleCallback(code, userId = null) {
    try {
      return await gmailClient.handleOAuthCallback(code, userId);
    } catch (error) {
      console.error('[EmailService] Google OAuth callback error:', error);
      throw ApiError.badRequest(`Google OAuth authentication failed: ${error.message}`);
    }
  }

  /**
   * Gets current Gmail connection status.
   * @param {string} [userId] 
   */
  async getGoogleConnectionStatus(userId = null) {
    return await gmailClient.getConnectionStatus(userId);
  }

  /**
   * Disconnects current Gmail account.
   * @param {string} [userId] 
   */
  async disconnectGoogle(userId = null) {
    return await gmailClient.disconnect(userId);
  }

  /**
   * Generates AI email subject and body content.
   * @param {{ prompt: string, tone?: string, action?: string, existingBody?: string, existingSubject?: string }} options 
   */
  async generateEmail(options) {
    try {
      return await emailAgent.generateEmail(options);
    } catch (error) {
      console.error('[EmailService] Error generating email:', error);
      throw ApiError.internal(`Failed to generate email: ${error.message}`);
    }
  }

  /**
   * Sends email using Gmail API.
   * @param {{ to: string, subject: string, body: string, attachments?: Array }} options 
   * @param {string} [userId] 
   */
  async sendEmail(options, userId = null) {
    try {
      return await gmailClient.sendEmail(options, userId);
    } catch (error) {
      console.error('[EmailService] Error sending email via Gmail API:', error);
      throw ApiError.badRequest(`Gmail API transmission failed: ${error.message}`);
    }
  }
}


export const emailService = new EmailService();
export default emailService;
