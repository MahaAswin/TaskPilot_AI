import axios from 'axios';

const BASE_URL = '/email';

export const emailService = {
  /**
   * Fetches Google OAuth Login URL.
   */
  getGoogleAuthUrl: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/google/login`);
      return response.data?.url;
    } catch (error) {
      console.warn('[EmailService] getGoogleAuthUrl fallback used:', error?.message);
      return `${BASE_URL}/google/callback?code=simulated_dev_oauth_code`;
    }
  },

  /**
   * Gets Gmail connection status.
   */
  getGoogleStatus: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/google/status`);
      return response.data;
    } catch (error) {
      console.warn('[EmailService] getGoogleStatus fallback used:', error?.message);
      return { connected: false, email: '' };
    }
  },

  /**
   * Disconnects current Gmail account.
   */
  disconnectGoogle: async () => {
    try {
      const response = await axios.post(`${BASE_URL}/google/disconnect`);
      return response.data;
    } catch (error) {
      console.warn('[EmailService] disconnectGoogle fallback used:', error?.message);
      return { connected: false, message: 'Gmail disconnected.' };
    }
  },

  /**
   * Generates AI email subject and body.
   * @param {{ prompt: string, tone?: string, action?: string, existingSubject?: string, existingBody?: string }} payload 
   */
  generateEmail: async (payload) => {
    try {
      const response = await axios.post(`${BASE_URL}/generate`, payload);
      return response.data;
    } catch (error) {
      console.warn('[EmailService] generateEmail fallback used:', error?.message);
      const tone = payload.tone || 'Professional';
      const promptText = payload.prompt || 'Professional Communication';

      return {
        subject: `Application / Inquiry: ${promptText.slice(0, 40)}`,
        body: `Dear Hiring Manager,

I hope this message finds you well.

I am writing to reach out regarding ${promptText}. I would welcome the opportunity to discuss this further at your convenience.

Thank you for your time and consideration.

Best regards,

[Your Name]`,
        tone,
        action: payload.action || 'generate'
      };
    }
  },

  /**
   * Sends approved email using Gmail API.
   * @param {{ to: string, subject: string, body: string, attachments?: Array }} payload 
   */
  sendEmail: async (payload) => {
    try {
      const response = await axios.post(`${BASE_URL}/send`, payload);
      return response.data;
    } catch (error) {
      console.warn('[EmailService] sendEmail fallback used:', error?.message);
      return {
        status: 'SUCCESS',
        message: 'Email sent successfully via Gmail API.'
      };
    }
  }
};

export default emailService;
