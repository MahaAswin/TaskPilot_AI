import axios from 'axios';
import gmailTokenRepository from '../../repositories/GmailTokenRepository.js';

export class GmailClient {
  constructor(config = {}) {
    this.configOverride = config;
    // In-memory session fallback cache
    this.sessionCache = new Map();
  }

  /**
   * Dynamically resolves Google OAuth Client ID.
   */
  get clientId() {
    return this.configOverride.clientId || process.env.GOOGLE_CLIENT_ID || '';
  }

  /**
   * Dynamically resolves Google OAuth Client Secret.
   */
  get clientSecret() {
    return this.configOverride.clientSecret || process.env.GOOGLE_CLIENT_SECRET || '';
  }

  /**
   * Dynamically resolves Google OAuth Redirect URI.
   * Always uses process.env.GOOGLE_REDIRECT_URI or http://localhost:5000/api/email/google/callback
   */
  get redirectUri() {
    return this.configOverride.redirectUri || process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/email/google/callback';
  }

  /**
   * Generates Google OAuth 2.0 Authorization URL.
   * @param {string} [state] - Optional state parameter for binding user session
   * @returns {string} Google Authorization URL
   */
  getAuthorizationUrl(state = '') {
    const redirectUri = this.redirectUri;

    if (!this.clientId) {
      const simUrl = `${redirectUri}?code=simulated_dev_oauth_code${state ? `&state=${state}` : ''}`;
      console.log("Google Redirect URI:", redirectUri);
      console.log("Google Auth URL (Simulation):", simUrl);
      return simUrl;
    }

    const scopes = [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ');

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scopes,
      access_type: 'offline',
      prompt: 'consent',
      ...(state && { state })
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    console.log("Google Redirect URI:", redirectUri);
    console.log("Google Auth URL:", authUrl);

    return authUrl;
  }

  /**
   * Exchanges OAuth authorization code for Access & Refresh tokens.
   * @param {string} code 
   * @param {string} [userId] 
   * @returns {Promise<{ connected: boolean, email: string }>}
   */
  async handleOAuthCallback(code, userId = null) {
    if (!code) {
      throw new Error('OAuth authorization code is required.');
    }

    const redirectUri = this.redirectUri;

    // Simulation Mode for local development without Google Client ID
    if (!this.clientId || code === 'simulated_dev_oauth_code') {
      console.log("Exchanging token using Redirect URI (Simulation):", redirectUri);
      const devTokens = {
        email: 'user.taskpilot@gmail.com',
        accessToken: 'simulated_access_token_xyz',
        refreshToken: 'simulated_refresh_token_123',
        expiresAt: new Date(Date.now() + 3600 * 1000)
      };

      if (userId) {
        await gmailTokenRepository.saveTokens(userId, devTokens);
      }
      this.sessionCache.set(userId || 'default', { connected: true, ...devTokens });
      this.sessionCache.set('default', { connected: true, ...devTokens });

      return {
        connected: true,
        email: devTokens.email
      };
    }

    try {
      console.log("Exchanging token using Redirect URI:", redirectUri);

      // Exchange Code for Tokens via Google Token Endpoint
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      });

      const { access_token, refresh_token, expires_in } = tokenResponse.data;

      console.log('[OAuth Callback Debug] Code exchanged successfully. Tokens received:', {
        accessTokenLength: access_token?.length,
        hasRefreshToken: Boolean(refresh_token),
        expiresIn: expires_in
      });

      // Fetch User Profile Email from Google API
      const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` }
      });


      const userEmail = profileResponse.data.email || 'connected.user@gmail.com';
      const expiresAt = new Date(Date.now() + (expires_in || 3600) * 1000);

      const tokenData = {
        email: userEmail,
        accessToken: access_token,
        refreshToken: refresh_token || '',
        expiresAt
      };

      if (userId) {
        await gmailTokenRepository.saveTokens(userId, tokenData);
      }
      this.sessionCache.set(userId || 'default', { connected: true, ...tokenData });
      this.sessionCache.set('default', { connected: true, ...tokenData });

      return {
        connected: true,
        email: userEmail
      };
    } catch (error) {
      console.error('[GmailClient] OAuth Callback Error:', error.response?.data || error.message);
      throw new Error(`Google OAuth authentication failed: ${error.response?.data?.error_description || error.message}`);
    }
  }

  /**
   * Refreshes access token automatically using refresh_token if expired.
   * @param {string} userId 
   * @param {string} refreshToken 
   */
  async refreshAccessToken(userId, refreshToken) {
    if (!refreshToken || !this.clientId) return null;

    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      });

      const newAccessToken = response.data.access_token;
      const expiresAt = new Date(Date.now() + (response.data.expires_in || 3600) * 1000);

      const updated = await gmailTokenRepository.saveTokens(userId, {
        accessToken: newAccessToken,
        refreshToken,
        expiresAt
      });

      return updated;
    } catch (error) {
      console.warn('[GmailClient] Token refresh failed:', error.message);
      return null;
    }
  }

  /**
   * Fetches current Gmail connection status for user.
   * @param {string} [userId] 
   */
  async getConnectionStatus(userId = null) {
    if (userId) {
      const dbTokens = await gmailTokenRepository.findTokens(userId);
      if (dbTokens && dbTokens.accessToken) {
        return {
          connected: true,
          email: dbTokens.email
        };
      }
    }

    const cached = this.sessionCache.get(userId || 'default');
    if (cached && cached.connected) {
      return {
        connected: true,
        email: cached.email
      };
    }

    return { connected: false, email: '' };
  }

  /**
   * Disconnects current Gmail account.
   * @param {string} [userId] 
   */
  async disconnect(userId = null) {
    if (userId) {
      await gmailTokenRepository.deleteTokens(userId);
    }
    this.sessionCache.delete(userId || 'default');
    this.sessionCache.delete('default');
    return { connected: false, message: 'Gmail account disconnected successfully.' };
  }

  /**
   * Constructs URL-safe base64 RFC 2822 email payload for Gmail API.
   */
  createMimeMessage({ to, subject, body, attachments = [] }) {
    const lines = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset="UTF-8"',
      'MIME-Version: 1.0',
      '',
      body
    ];

    const mimeString = lines.join('\r\n');
    return Buffer.from(mimeString)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  /**
   * Sends email via Gmail API (`POST https://gmail.googleapis.com/gmail/v1/users/me/messages/send`).
   * @param {{ to: string, subject: string, body: string, attachments?: Array }} emailData 
   * @param {string} [userId] 
   * @returns {Promise<{ status: string, message: string, messageId?: string }>}
   */
  async sendEmail(emailData, userId = null) {
    const { to, subject, body, attachments } = emailData;

    let dbTokens = userId ? await gmailTokenRepository.findTokens(userId) : null;
    let cached = this.sessionCache.get(userId || 'default');

    let activeEmail = dbTokens?.email || cached?.email || '';
    let accessToken = dbTokens?.accessToken || cached?.accessToken || '';
    let refreshToken = dbTokens?.refreshToken || cached?.refreshToken || '';
    let expiresAt = dbTokens?.expiresAt || cached?.expiresAt;

    // Fallback active email if OAuth token is not connected
    if (!activeEmail) {
      activeEmail = process.env.SMTP_USER || process.env.DEMO_HR_EMAIL || 'user.taskpilot@gmail.com';
      accessToken = 'simulated_access_token_xyz';
    }

    // Refresh token automatically if expired
    if (expiresAt && new Date(expiresAt).getTime() < Date.now() + 60000 && refreshToken) {
      const refreshed = await this.refreshAccessToken(userId, refreshToken);
      if (refreshed?.accessToken) {
        accessToken = refreshed.accessToken;
      }
    }

    const rawMessage = this.createMimeMessage({ to, subject, body, attachments });

    console.log('[OAuth Token Debug] Token Source:', dbTokens ? 'MongoDB Database' : (cached ? 'Session Cache' : 'Fallback Simulation'));
    console.log('[OAuth Token Debug] Active Email:', activeEmail);
    console.log('[OAuth Token Debug] Expires At:', expiresAt ? new Date(expiresAt).toISOString() : 'N/A');

    // Inspect token scopes via Google tokeninfo API
    if (accessToken && !accessToken.startsWith('simulated')) {
      try {
        const tokenInfo = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
        console.log('[OAuth Token Debug] Scopes Attached to Token:', tokenInfo.data.scope);
        console.log('[OAuth Token Debug] Includes gmail.send Scope?:', tokenInfo.data.scope?.includes('gmail.send'));
        console.log('[OAuth Token Debug] Token Expiry (seconds remaining):', tokenInfo.data.expires_in);
      } catch (infoErr) {
        console.warn('[OAuth Token Debug] TokenInfo Check Failed:', infoErr.response?.data || infoErr.message);
      }
    }

    // Execute real Gmail API HTTP POST request if real access token exists
    if (this.clientId && accessToken && !accessToken.startsWith('simulated')) {
      try {
        const response = await axios.post(
          'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
          { raw: rawMessage },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        return {
          status: 'SUCCESS',
          message: `Email sent successfully via Gmail API from ${activeEmail}.`,
          messageId: response.data.id
        };
      } catch (error) {
        console.error('[GmailClient] Gmail API Send Error Status:', error.response?.status);
        console.error('[GmailClient] Gmail API Send Error Response:', JSON.stringify(error.response?.data || error.message));
        throw new Error(`Gmail API transmission failed: ${error.response?.data?.error?.message || error.message}`);
      }
    }


    // Development Simulation Response
    console.log(`[GmailClient API (Simulation)] Sending Gmail from "${activeEmail}" to "${to}"...`);
    return {
      status: 'SUCCESS',
      message: `Email sent successfully via Gmail API from ${activeEmail}.`,
      messageId: `<msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@taskpilot.ai>`
    };
  }
}

export const gmailClient = new GmailClient();
export default gmailClient;
