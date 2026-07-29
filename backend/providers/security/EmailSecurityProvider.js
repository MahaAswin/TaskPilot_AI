import BaseSecurityProvider from './BaseSecurityProvider.js';

export class EmailSecurityProvider extends BaseSecurityProvider {
  constructor(config = {}) {
    super({ name: 'Email Threat & Spam Detector', timeout: config.timeout || 5000 });
  }

  /**
   * Analyzes email content for phishing, spam, urgency tactics, and domain spoofing.
   * @param {{ subject?: string, sender?: string, body: string }} emailData 
   * @returns {Promise<{
   *   status: string,
   *   risk: string,
   *   spamScore: number,
   *   indicators: string[],
   *   extractedLinks: string[],
   *   providerName: string
   * }>}
   */
  async checkEmail(emailData) {
    const { subject = '', sender = '', body = '' } = emailData;
    const fullText = `${subject} ${sender} ${body}`.toLowerCase();

    const indicators = [];
    let score = 0;

    // 1. Urgency and Pressure Tactics (+25)
    const urgencyRegex = /(urgent|account suspended|immediate action|verify within 24|final notice|unauthorized access|security breach|locked account|wire transfer)/i;
    if (urgencyRegex.test(fullText)) {
      score += 25;
      indicators.push('High-pressure urgency tactics detected (e.g., threat of account suspension)');
    }

    // 2. Credential & Financial Harvesting Keywords (+25)
    const financialRegex = /(password reset|login credentials|verify your ssn|credit card|bank account|update billing|invoice attached|gift card|crypto payout)/i;
    if (financialRegex.test(fullText)) {
      score += 25;
      indicators.push('Credential or sensitive financial information request detected');
    }

    // 3. Sender Domain Spoofing Heuristics (+20)
    if (sender) {
      const isFreeDomain = /@(gmail|yahoo|hotmail|outlook)\.com/i.test(sender);
      const claimsOfficialBrand = /(paypal|amazon|apple|microsoft|google|bank|chase|wellsfargo|support|admin|helpdesk)/i.test(fullText);

      if (isFreeDomain && claimsOfficialBrand) {
        score += 25;
        indicators.push(`Possible domain spoofing: Sender "${sender}" uses a free webmail address while claiming official corporate communications.`);
      }
    }

    // 4. Extracted Links & Suspicious TLDs (+20)
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const extractedLinks = body.match(urlRegex) || [];
    if (extractedLinks.length > 0) {
      indicators.push(`Extracted ${extractedLinks.length} embedded link(s) for security verification`);

      const hasSuspiciousTLD = extractedLinks.some(link => /\.(xyz|top|work font|click|zip|biz|tk|cc)\b/i.test(link) || /http:\/\/\d{1,3}\.\d{1,3}/.test(link));
      if (hasSuspiciousTLD) {
        score += 25;
        indicators.push('Contains links pointing to high-risk TLDs or raw IP addresses');
      }
    }

    // 5. Generic / Impersonal Greeting (+10)
    if (/(dear customer|dear user|dear account holder|valued customer|dear member)/i.test(body)) {
      score += 10;
      indicators.push('Generic impersonal salutation ("Dear Customer") common in mass phishing campaigns');
    }

    // Determine Status and Risk Level
    let status = 'Safe';
    let risk = 'Low';

    if (score >= 50) {
      status = 'Phishing';
      risk = score >= 75 ? 'Critical' : 'High';
    } else if (score >= 25) {
      status = 'Spam';
      risk = 'Medium';
    } else {
      status = 'Safe';
      risk = 'Low';
    }

    return {
      status,
      risk,
      spamScore: Math.min(score, 100),
      indicators: indicators.length > 0 ? indicators : ['No obvious phishing or spam indicators detected.'],
      extractedLinks,
      providerName: this.name
    };
  }
}

export default EmailSecurityProvider;
