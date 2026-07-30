import emailAgent from '../agents/email/EmailAgent.js';
import gmailClient from '../providers/email/GmailClient.js';
import smtpEmailProvider from '../providers/email/SmtpEmailProvider.js';
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
      console.log(`[EmailService] Delegating email generation to EmailAgent...`);
      const result = await emailAgent.generateEmail(options);
      console.log(`[EmailService] EmailAgent returned result successfully.`);
      return result;
    } catch (error) {
      console.error('[EmailService] Error generating email:', error.stack || error.message);
      throw ApiError.internal(`Failed to generate email: ${error.message}`);
    }
  }

  /**
   * Sends email using existing EmailService engine (Gmail API / OAuth).
   * @param {{ to: string, subject: string, body: string, attachments?: Array }} options 
   * @param {string} [userId] 
   */
  async sendEmail(options, userId = null) {
    const { to, subject, body } = options || {};

    if (!to || !to.includes('@')) {
      throw ApiError.badRequest('Valid recipient email address ("to") is required.');
    }
    if (!subject || !subject.trim()) {
      throw ApiError.badRequest('Email subject is required.');
    }
    if (!body || !body.trim()) {
      throw ApiError.badRequest('Email body content is required.');
    }

    try {
      // Execute email delivery via Gmail API Engine (used by AI Email Agent)
      return await gmailClient.sendEmail(options, userId);
    } catch (error) {
      console.error('[EmailService] Error sending email:', error.stack || error.message);
      throw ApiError.badRequest(`Email delivery failed: ${error.message}`);
    }
  }

  /**
   * Alias for sendEmail to support sendMail call signatures.
   */
  async sendMail(options, userId = null) {
    return await this.sendEmail(options, userId);
  }
}

export const emailService = new EmailService();
export default emailService;
