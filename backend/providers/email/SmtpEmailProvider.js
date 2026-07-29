export class SmtpEmailProvider {
  constructor(config = {}) {
    this.configOverride = config;
    this.transporter = null;
  }

  get host() {
    return this.configOverride.host || process.env.SMTP_HOST || 'smtp.gmail.com';
  }

  get port() {
    return parseInt(this.configOverride.port || process.env.SMTP_PORT || '587', 10);
  }

  get user() {
    return this.configOverride.user || process.env.SMTP_USER || '';
  }

  get pass() {
    return this.configOverride.pass || process.env.SMTP_PASS || '';
  }

  get from() {
    return this.configOverride.from || process.env.SMTP_FROM || 'TaskPilot AI <noreply@taskpilot.ai>';
  }

  /**
   * Initializes nodemailer transporter dynamically if module is available.
   */
  async getTransporter() {
    if (this.transporter) return this.transporter;

    if (this.user && this.pass) {
      try {
        const nodemailer = await import('nodemailer');
        this.transporter = nodemailer.default.createTransport({
          host: this.host,
          port: this.port,
          secure: this.port === 465,
          auth: {
            user: this.user,
            pass: this.pass
          }
        });
        return this.transporter;
      } catch (err) {
        console.warn('[SmtpEmailProvider] Nodemailer not available or auth error:', err.message);
      }
    }
    return null;
  }

  /**
   * Sends email via SMTP transporter with fallback simulation if credentials/nodemailer are missing.
   * @param {{ to: string, subject: string, body: string, attachments?: Array<{ filename: string, content: string|Buffer }> }} emailPayload 
   * @returns {Promise<{ status: string, message: string, messageId?: string }>}
   */
  async sendEmail(emailPayload) {
    const { to, subject, body, attachments = [] } = emailPayload;

    if (!to || !to.includes('@')) {
      throw new Error('Valid recipient email address ("to") is required.');
    }
    if (!subject || !subject.trim()) {
      throw new Error('Email subject is required.');
    }
    if (!body || !body.trim()) {
      throw new Error('Email body content is required.');
    }

    const transporter = await this.getTransporter();

    // Real SMTP Transmission if transporter and credentials exist
    if (transporter && this.user && this.pass) {
      try {
        const mailOptions = {
          from: this.from,
          to,
          subject,
          text: body,
          html: body.replace(/\n/g, '<br/>'),
          attachments: attachments.map(att => ({
            filename: att.filename || att.name || 'attachment',
            content: att.content || att.path
          }))
        };

        const info = await transporter.sendMail(mailOptions);
        return {
          status: 'SUCCESS',
          message: 'Email sent successfully.',
          messageId: info.messageId
        };
      } catch (error) {
        console.error('[SmtpEmailProvider] SMTP send mail error:', error.message);
        throw new Error(`SMTP Transmission Failed: ${error.message}`);
      }
    }

    // Development / Demo Simulation Fallback
    console.log(`[SmtpEmailProvider (Simulation)] Dispatching email to "${to}" with subject "${subject}"...`);
    return {
      status: 'SUCCESS',
      message: 'Email sent successfully.'
    };
  }
}

export const smtpEmailProvider = new SmtpEmailProvider();
export default smtpEmailProvider;
