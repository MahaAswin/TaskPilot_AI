import BaseAgent from '../BaseAgent.js';
import securityProviderRegistry from '../../providers/security/SecurityProviderRegistry.js';
import ProviderManager from '../../providers/ProviderManager.js';

export class PhoneIntelligenceAgent extends BaseAgent {
  constructor() {
    super('PhoneIntelligenceAgent', 'Abstract Phone Number Intelligence & Verification Agent');
  }

  /**
   * Executes phone number intelligence verification via Abstract Phone API.
   * @param {string|{ phone: string }} phoneInput - Phone string or object containing phone
   * @param {object} [context={}] 
   * @returns {Promise<{
   *   status: string,
   *   country: string,
   *   countryCode: string,
   *   carrier: string,
   *   lineType: string,
   *   internationalFormat: string,
   *   localFormat: string,
   *   summary: string,
   *   recommendation: string,
   *   reason?: string,
   *   details?: object
   * }>}
   */
  async execute(phoneInput, context = {}) {
    const phone = typeof phoneInput === 'string' ? phoneInput : phoneInput?.phone || '';

    if (!phone || typeof phone !== 'string') {
      throw new Error('Valid phone number string is required for Phone Intelligence Agent execution.');
    }

    // Step 1: Query Abstract Phone Validation API via Provider Registry
    const phoneResult = await securityProviderRegistry.checkPhoneReputation(phone.trim());

    // Step 2: Synthesize AI explanation and recommendation
    return await this.synthesizeReport(phone.trim(), phoneResult, context);
  }

  /**
   * Synthesizes phone validation metrics into AI explanations.
   */
  async synthesizeReport(phone, phoneResult, context = {}) {
    const {
      status,
      country,
      countryCode,
      carrier,
      lineType,
      internationalFormat,
      localFormat,
      valid,
      location,
      timeZone,
      reason,
      providerName
    } = phoneResult;

    let summary = '';
    let recommendation = '';

    if (status === 'VALID') {
      const typeDesc = lineType !== 'Unknown' ? lineType.toLowerCase() : 'telecommunication';
      const carrierDesc = carrier !== 'Unknown' ? `belongs to the ${carrier} network` : 'has valid carrier routing';
      summary = `This phone number appears to be a valid ${country !== 'Unknown' ? country : ''} ${typeDesc} number. It ${carrierDesc} and follows the correct numbering format. No anomalies were detected.`;
      recommendation = 'This phone number appears safe and valid.';
    } else {
      summary = reason || 'The phone number format is invalid or lacks valid carrier routing information.';
      recommendation = 'Please verify the phone number before using it.';
    }

    // AI Enrichment via ProviderManager if GEMINI_API_KEY is available
    try {
      if (process.env.GEMINI_API_KEY && ProviderManager) {
        const prompt = `You are a Cybersecurity Telecom Specialist. Analyze this phone number intelligence report from Abstract Phone Validation API and generate a concise AI summary and recommendation.

Phone Number: ${phone}
Status: ${status}
Country: ${country} (${countryCode})
Carrier: ${carrier}
Line Type: ${lineType} (Mobile / Landline / VoIP)
International Format: ${internationalFormat}
Local Format: ${localFormat}

Explain:
1. Whether the phone number appears legitimate.
2. Whether it belongs to a mobile, landline, or VoIP service.
3. Whether the format is valid.
4. Any potential risks (e.g. VoIP numbers associated with anonymous virtual callers).

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
      console.warn('[PhoneIntelligenceAgent] AI explanation fallback used:', aiErr.message);
    }

    return {
      status,
      country: country || 'Unknown',
      countryCode: countryCode || '',
      carrier: carrier || 'Unknown',
      lineType: lineType || 'Unknown',
      internationalFormat: status === 'VALID' ? internationalFormat : '',
      localFormat: status === 'VALID' ? localFormat : '',
      summary,
      recommendation,
      ...(status === 'INVALID' && { reason: reason || 'The phone number format is invalid or could not be verified.' }),
      details: {
        rawPhone: phone,
        location,
        timeZone,
        provider: providerName
      }
    };
  }
}

export const phoneIntelligenceAgent = new PhoneIntelligenceAgent();
export default phoneIntelligenceAgent;
