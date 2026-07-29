import BaseAgent from '../BaseAgent.js';
import securityProviderRegistry from '../../providers/security/SecurityProviderRegistry.js';
import ProviderManager from '../../providers/ProviderManager.js';

export class EmailSecurityAgent extends BaseAgent {
  constructor() {
    super('EmailSecurityAgent', 'Abstract Email Reputation & Quality Verifier');
  }

  /**
   * Executes email address reputation analysis via Abstract Email API.
   * @param {string|{ email: string }} emailInput - Email string or object containing email
   * @param {object} [context={}] 
   * @returns {Promise<{
   *   status: string,
   *   deliverability: string,
   *   smtpValid: boolean,
   *   mxValid: boolean,
   *   formatValid: boolean,
   *   disposable: boolean,
   *   quality: string,
   *   summary: string,
   *   recommendation: string,
   *   reason?: string,
   *   details?: object
   * }>}
   */
  async execute(emailInput, context = {}) {
    const email = typeof emailInput === 'string' ? emailInput : emailInput?.email || '';

    if (!email || typeof email !== 'string') {
      throw new Error('Valid email address is required for Email Security Agent execution.');
    }

    // Step 1: Query Abstract Email Reputation API via Provider Registry
    const repResult = await securityProviderRegistry.checkEmailReputation(email.trim());

    // Step 2: Synthesize AI Explanation & Recommendations
    return await this.synthesizeReport(email.trim(), repResult, context);
  }

  /**
   * Synthesizes Abstract Email validation stats into AI explanations.
   */
  async synthesizeReport(email, repResult, context = {}) {
    const {
      status,
      deliverability,
      smtpValid,
      mxValid,
      formatValid,
      disposable,
      suggestedCorrection,
      domain,
      quality,
      qualityScore,
      isFreeEmail,
      reason,
      providerName
    } = repResult;

    // Build default AI Summary based on API findings
    let summary = '';
    let recommendation = '';

    if (status === 'VALID') {
      summary = `This email address (${email}) appears to be legitimate and capable of receiving emails. The domain (${domain}) has valid mail servers (MX) configured, SMTP validation passed successfully, and the address is not associated with disposable email providers.`;
      recommendation = 'This email appears safe to use for communication and account registration.';
    } else {
      summary = reason
        ? `This email address is invalid or non-functional: ${reason}`
        : 'This email address is invalid or lacks valid mail server records.';
      recommendation = 'Verify the email address before continuing or requesting account verification.';
    }

    // AI Explanation Enrichment via ProviderManager if GEMINI_API_KEY is available
    try {
      if (process.env.GEMINI_API_KEY && ProviderManager) {
        const prompt = `You are a Cybersecurity Email Verification Specialist. Analyze this email reputation report from Abstract Email API and generate a concise AI summary and recommendation.

Email Address: ${email}
Status: ${status}
Deliverability: ${deliverability}
Format Valid: ${formatValid}
MX Server Records Found: ${mxValid}
SMTP Validation: ${smtpValid}
Disposable Email: ${disposable ? 'Yes (Temporary Mail)' : 'No (Permanent Email)'}
Quality Rating: ${quality} (${qualityScore})
Suggested Correction: ${suggestedCorrection || 'None'}

In your summary, clearly explain:
1. Whether the email appears trustworthy and likely belongs to a real user.
2. Whether it is disposable or temporary.
3. Whether it can receive messages.
4. Any potential risks.

Return ONLY valid JSON matching this schema:
{
  "summary": "Detailed 2-3 sentence AI summary explanation",
  "recommendation": "1-2 sentence actionable recommendation for the user"
}`;

        const aiResponse = await ProviderManager.generateStructuredResponse(prompt, {
          type: 'object',
          properties: {
            summary: { type: 'string' },
            recommendation: { type: 'string' }
          }
        });

        if (aiResponse?.summary && aiResponse?.recommendation) {
          summary = aiResponse.summary;
          recommendation = aiResponse.recommendation;
        }
      }
    } catch (aiErr) {
      console.warn('[EmailSecurityAgent] AI explanation fallback used:', aiErr.message);
    }

    return {
      status,
      deliverability,
      smtpValid,
      mxValid,
      formatValid,
      disposable,
      quality,
      summary,
      recommendation,
      ...(reason && { reason }),
      details: {
        email,
        domain,
        suggestedCorrection,
        isFreeEmail,
        qualityScore,
        provider: providerName
      }
    };
  }
}

export const emailSecurityAgent = new EmailSecurityAgent();
export default emailSecurityAgent;
