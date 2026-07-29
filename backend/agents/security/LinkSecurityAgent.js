import BaseAgent from '../BaseAgent.js';
import securityProviderRegistry from '../../providers/security/SecurityProviderRegistry.js';
import ProviderManager from '../../providers/ProviderManager.js';

export class LinkSecurityAgent extends BaseAgent {
  constructor() {
    super('LinkSecurityAgent', 'VirusTotal URL Reputation Security Analyzer');
  }

  /**
   * Evaluates URL security reputation via VirusTotal & AI Explainer.
   * @param {string} url - Target URL to check
   * @param {object} [context={}] - Optional request metadata
   * @returns {Promise<{
   *   status: string,
   *   risk: string,
   *   threats: string[],
   *   detectionSummary: string,
   *   explanation: { whatWasDetected: string, whyDangerous: string, riskLevel: string, recommendedAction: string },
   *   recommendation: string,
   *   details: object
   * }>}
   */
  async execute(url, context = {}) {
    if (!url || typeof url !== 'string') {
      throw new Error('Valid URL string is required for Link Security Agent execution.');
    }

    // Step 1: Query VirusTotal reputation via provider registry
    const vtResult = await securityProviderRegistry.checkLinkReputation(url);

    // Step 2: Synthesize AI explanation and structured security findings
    return await this.synthesizeReport(url, vtResult, context);
  }

  /**
   * Synthesizes VirusTotal engine detections into AI explanation & recommendations.
   */
  async synthesizeReport(url, vtResult, context = {}) {
    const { status, risk, threats = [], stats = {}, enginesFlagged = [], rawDetails } = vtResult;

    const flaggedCount = enginesFlagged.length;
    const totalEngines = rawDetails?.totalEngines || (stats.malicious + stats.suspicious + stats.harmless + stats.undetected) || 70;

    let detectionSummary = '';
    if (status === 'Malicious') {
      detectionSummary = `Flagged as malicious by ${flaggedCount} of ${totalEngines} security vendors (${enginesFlagged.slice(0, 3).join(', ')}).`;
    } else if (status === 'Suspicious') {
      detectionSummary = `Flagged as suspicious by ${flaggedCount} security vendor(s). Potential risk detected.`;
    } else if (status === 'Safe') {
      detectionSummary = `No security vendors flagged this URL out of ${totalEngines} engines analyzed.`;
    } else {
      detectionSummary = 'URL reputation could not be verified automatically by security vendors.';
    }

    // Default AI Explanation structure
    let explanation = {
      whatWasDetected: status === 'Safe'
        ? 'No malicious payloads, phishing indicators, or malware signatures were detected.'
        : `Detected ${threats.join(', ') || 'security anomalies'} across ${flaggedCount} security engines.`,
      whyDangerous: status === 'Safe'
        ? 'The domain shows a clean reputation record with no known active exploits.'
        : 'Visiting flagged URLs may expose your device to credential theft, drive-by malware downloads, or phishing forms.',
      riskLevel: `${risk} Risk (${status})`,
      recommendedAction: status === 'Safe'
        ? 'You can proceed to visit this URL safely, but remain cautious when entering credentials.'
        : 'Avoid navigating to this link or entering personal credentials.'
    };

    let recommendation = explanation.recommendedAction;

    // Enrich explanation via AI Provider if GEMINI_API_KEY / ProviderManager is active
    try {
      if (process.env.GEMINI_API_KEY && ProviderManager) {
        const prompt = `You are an expert Cybersecurity AI Assistant. Analyze this URL reputation report and generate a clear, professional security assessment.
Target URL: ${url}
Reputation Status: ${status}
Risk Level: ${risk}
Threat Categories: ${JSON.stringify(threats)}
Flagged Engines: ${enginesFlagged.join(', ')}

Return ONLY valid JSON matching this schema:
{
  "whatWasDetected": "Clear 1-2 sentence description of what security engines found",
  "whyDangerous": "1-2 sentence description of potential danger (or why safe)",
  "riskLevel": "Risk assessment description",
  "recommendedAction": "1 sentence guidance for the user"
}`;

        const aiResponse = await ProviderManager.generateStructuredResponse(prompt, {
          type: 'object',
          properties: {
            whatWasDetected: { type: 'string' },
            whyDangerous: { type: 'string' },
            riskLevel: { type: 'string' },
            recommendedAction: { type: 'string' }
          }
        });

        if (aiResponse?.whatWasDetected && aiResponse?.recommendedAction) {
          explanation = {
            whatWasDetected: aiResponse.whatWasDetected,
            whyDangerous: aiResponse.whyDangerous || explanation.whyDangerous,
            riskLevel: aiResponse.riskLevel || explanation.riskLevel,
            recommendedAction: aiResponse.recommendedAction
          };
          recommendation = aiResponse.recommendedAction;
        }
      }
    } catch (aiErr) {
      console.warn('[LinkSecurityAgent] AI explanation fallback used:', aiErr.message);
    }

    return {
      status,
      risk,
      threats,
      detectionSummary,
      explanation,
      recommendation,
      details: {
        provider: 'VirusTotal',
        stats,
        enginesFlagged,
        totalEnginesAnalyzed: totalEngines
      }
    };
  }
}

export const linkSecurityAgent = new LinkSecurityAgent();
export default linkSecurityAgent;
