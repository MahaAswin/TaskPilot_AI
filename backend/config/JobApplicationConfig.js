/**
 * Configuration manager for Job Application module.
 * Provides configurable HR recipient mailbox and environment settings.
 */
export class JobApplicationConfig {
  static get demoHrEmail() {
    return process.env.DEMO_HR_EMAIL || 'mahaaswin.sb2024it@sece.ac.in';
  }

  static get isDemoMode() {
    return process.env.JOB_APP_DEMO_MODE !== 'false';
  }

  /**
   * Resolves target recipient email. In demo mode, routes to demo HR mailbox.
   * @param {string} fallbackEmail 
   * @returns {string}
   */
  static getRecipientEmail(fallbackEmail = null) {
    if (this.isDemoMode) {
      return this.demoHrEmail;
    }
    return fallbackEmail || this.demoHrEmail;
  }
}

export default JobApplicationConfig;
