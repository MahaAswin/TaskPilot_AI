import BaseAgent from '../BaseAgent.js';
import securityProviderRegistry from '../../providers/security/SecurityProviderRegistry.js';
import ProviderManager from '../../providers/ProviderManager.js';

export class WebsiteAnalysisAgent extends BaseAgent {
  constructor() {
    super('WebsiteAnalysisAgent', 'urlscan.io Behavioral Website Security Analyzer');
  }

  /**
   * Performs deep website behavioral analysis via urlscan.io & AI Explainer.
   * @param {string} url - Target URL to analyze
   * @param {object} [context={}] - Optional session/user context
   */
  async execute(url, context = {}) {
    if (!url || typeof url !== 'string') {
      throw new Error('Valid URL string is required for Website Analysis Agent execution.');
    }

    // Step 1: Execute behavioral scan via urlscan.io provider
    const analysisResult = await securityProviderRegistry.analyzeWebsiteBehavior(url);

    // Step 2: Synthesize AI explanation and behavioral metrics
    return await this.synthesizeReport(url, analysisResult, context);
  }

  /**
   * Synthesizes page behavioral metrics into structured AI security report.
   */
  async synthesizeReport(url, analysisResult, context = {}) {
    const {
      status,
      risk,
      redirectChains = [],
      suspiciousScripts = [],
      networkRequests = {},
      externalResources = [],
      pageMetadata = {},
      httpsStatus = {},
      screenshot = '',
      providerName = 'urlscan.io'
    } = analysisResult;

    // Build initial AI Explanation structure
    let explanation = {
      whatWasDetected: status === 'Safe'
        ? `Loaded ${pageMetadata.title || 'page'} smoothly over ${httpsStatus.isHttps ? 'SSL/HTTPS' : 'HTTP'} with ${networkRequests.total || 0} network requests.`
        : `Detected ${suspiciousScripts.length} suspicious script(s) and ${redirectChains.length} redirect hop(s) during page load.`,
      whyDangerous: !httpsStatus.isHttps
        ? 'Unencrypted HTTP connection allows network eavesdropping and man-in-the-middle data tampering.'
        : suspiciousScripts.length > 0
          ? 'External scripts loaded from unverified third-party domains may inject malicious trackers or steal input data.'
          : 'No dangerous runtime anomalies detected during website behavioral inspection.',
      riskLevel: `${risk} Behavioral Risk (${status})`,
      recommendedAction: !httpsStatus.isHttps
        ? 'Do not submit passwords, credit card numbers, or personal data on unencrypted pages.'
        : status === 'Safe'
          ? 'The website behavior appears standard with valid SSL encryption.'
          : 'Exercise caution and verify the website identity before interacting with interactive elements.'
    };

    let recommendation = explanation.recommendedAction;

    // AI Enrichment via ProviderManager if available
    try {
      if (process.env.GEMINI_API_KEY && ProviderManager) {
        const prompt = `You are a Senior Web Security Analyst. Synthesize this website behavioral inspection report into an AI explanation.
Target URL: ${url}
Page Title: ${pageMetadata.title}
Server IP & ASN: ${pageMetadata.ip} | ${pageMetadata.asn}
HTTPS / SSL Status: ${httpsStatus.isHttps ? 'Encrypted' : 'Unencrypted HTTP'} (${httpsStatus.issuer})
Redirect Hops: ${redirectChains.join(' -> ')}
Suspicious Scripts Detected: ${JSON.stringify(suspiciousScripts)}
Network Requests: ${networkRequests.total} requests (${networkRequests.securePercentage}% HTTPS)

Return ONLY valid JSON matching this schema:
{
  "whatWasDetected": "Clear summary of behavioral inspection",
  "whyDangerous": "Explanation of potential threats or risks",
  "riskLevel": "Overall risk assessment string",
  "recommendedAction": "Actionable security recommendation"
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
      console.warn('[WebsiteAnalysisAgent] AI explanation fallback used:', aiErr.message);
    }

    return {
      status,
      risk,
      redirectChains,
      suspiciousScripts,
      networkRequests,
      externalResources,
      pageMetadata,
      httpsStatus,
      explanation,
      recommendation,
      screenshot,
      details: {
        provider: providerName,
        inspectedUrl: url
      }
    };
  }
}

export const websiteAnalysisAgent = new WebsiteAnalysisAgent();
export default websiteAnalysisAgent;
