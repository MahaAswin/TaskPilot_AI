import BaseAgent from '../BaseAgent.js';
import ProviderManager from '../../providers/ProviderManager.js';
import gmailClient from '../../providers/email/GmailClient.js';

export class EmailAgent extends BaseAgent {
  constructor() {
    super('EmailAgent', 'AI Email Composition & Gmail API Transmission Agent');
  }

  /**
   * Generates or improves an email using AI based on user prompt and selected tone.
   * @param {{ prompt: string, tone?: string, action?: string, existingBody?: string, existingSubject?: string }} options 
   * @returns {Promise<{ subject: string, body: string, tone: string, action: string }>}
   */
  async generateEmail(options = {}) {
    const promptText = (options.prompt || '').trim();
    const tone = options.tone || 'Professional';
    const action = options.action || 'generate';
    const existingBody = (options.existingBody || '').trim();
    const existingSubject = (options.existingSubject || '').trim();

    if (!promptText && !existingBody) {
      throw new Error('Email prompt or existing email content is required.');
    }

    // 1. Try Gemini LLM Generation via ProviderManager
    try {
      if (process.env.GEMINI_API_KEY && ProviderManager) {
        const systemInstruction = `You are an expert Executive AI Email Specialist for TaskPilot AI.
Task Action: "${action.toUpperCase()}"
Requested Tone: "${tone}"
User Prompt / Goal: "${promptText}"
${existingBody ? `Existing Email Body to Modify:\n"""${existingBody}"""` : ''}

Generate a polished, professional email. Include:
- A concise, high-converting Subject line.
- Proper opening greeting (e.g., "Dear Hiring Manager," or "Hello [Name],").
- Well-structured, clear body paragraphs in the "${tone}" tone.
- Courteous sign-off and signature template (e.g., "Best regards,\n[Your Name]").

Return ONLY valid JSON matching this schema:
{
  "subject": "Clear Professional Subject Line",
  "body": "Full Email Body Text including Greeting, Body, and Sign-off"
}`;

        const aiResult = await ProviderManager.generateStructuredResponse(systemInstruction, {
          type: 'object',
          properties: {
            subject: { type: 'string' },
            body: { type: 'string' }
          }
        });

        if (aiResult?.subject && aiResult?.body) {
          return {
            subject: aiResult.subject,
            body: aiResult.body,
            tone,
            action
          };
        }
      }
    } catch (err) {
      console.warn('[EmailAgent] LLM generation fallback used:', err.message);
    }

    // 2. Resilient Template Generator Fallback
    return this.getFallbackGeneratedEmail(promptText, tone, action, existingSubject, existingBody);
  }

  /**
   * Resilient fallback email templates & AI utility rewrites.
   */
  getFallbackGeneratedEmail(promptText, tone, action, existingSubject, existingBody) {
    const promptLower = promptText.toLowerCase();

    if (action === 'shorter' && existingBody) {
      const sentences = existingBody.split('. ');
      const shortened = sentences.slice(0, Math.max(2, Math.floor(sentences.length / 2))).join('. ') + '.';
      return {
        subject: existingSubject || 'Concise Inquiry',
        body: shortened,
        tone,
        action: 'shorter'
      };
    }

    if (action === 'improve' && existingBody) {
      return {
        subject: existingSubject || 'Updated Communication',
        body: existingBody.replace(/i want to/gi, 'I would like to').replace(/thanks/gi, 'Thank you for your time'),
        tone,
        action: 'improve'
      };
    }

    // Preset Prompt Templates
    if (promptLower.includes('internship') || promptLower.includes('job') || tone === 'Job Application') {
      return {
        subject: 'Application for Internship Opportunity - Computer Science Student',
        body: `Dear Hiring Manager,

I hope this email finds you well.

I am writing to formally express my strong interest in an internship opportunity with your esteemed team. As a passionate Computer Science student dedicated to building robust software systems, I have followed your organization's innovative work with great admiration.

My technical background includes hands-on experience in full-stack web development, software engineering principles, and multi-agent AI systems. I am eager to contribute to ongoing projects while gaining valuable industry experience under your guidance.

I have attached my Resume and Cover Letter for your review. Thank you for your time and consideration, and I look forward to the possibility of discussing how I can add value to your team.

Best regards,

[Your Name]
Computer Science Undergraduate
[Your Phone Number] | [Your LinkedIn Profile]`,
        tone,
        action
      };
    }

    if (promptLower.includes('apology') || tone === 'Apology') {
      return {
        subject: 'Apology for Delay and Project Update',
        body: `Dear Team,

Please accept my sincere apologies for the delay regarding our recent project delivery.

We encountered unexpected technical constraints that required additional quality assurance testing. The issues have now been resolved, and all deliverables have been verified.

Thank you for your patience and understanding. Please let me know if you have any questions.

Best regards,

[Your Name]`,
        tone,
        action
      };
    }

    if (promptLower.includes('thank') || tone === 'Thank You') {
      return {
        subject: 'Thank You for the Inspiring Meeting',
        body: `Dear [Recipient Name],

Thank you very much for taking the time to meet with me today.

I truly enjoyed learning more about your ongoing initiatives and vision. Your insights regarding our technical direction were incredibly valuable.

I look forward to our next steps and staying in touch.

Warm regards,

[Your Name]`,
        tone,
        action
      };
    }

    if (promptLower.includes('follow up') || tone === 'Follow Up') {
      return {
        subject: 'Follow-Up: Project Status & Next Steps',
        body: `Dear [Recipient Name],

I hope you are having a productive week.

I am following up on our previous discussion regarding the upcoming milestone deliverables. Please let me know if you need any additional information or documentation from my end.

Looking forward to hearing from you.

Best regards,

[Your Name]`,
        tone,
        action
      };
    }

    // Generic Prompt Template
    const topicSummary = promptText ? promptText : 'our upcoming discussion';

    return {
      subject: `Professional Communication: ${promptText ? promptText.slice(0, 40) : 'Inquiry'}`,
      body: `Dear [Recipient Name],

I hope this message finds you well.

I am writing to reach out regarding ${topicSummary}. We are committed to ensuring high standards of execution and seamless communication across all initiatives.

Please review the attached details at your earliest convenience. I look forward to your thoughts and feedback.

Best regards,

[Your Name]
TaskPilot AI User`,
      tone,
      action
    };
  }

  /**
   * Sends email via Gmail API client.
   * @param {{ to: string, subject: string, body: string, attachments?: array }} options 
   */
  async sendEmail(options) {
    return await gmailClient.sendEmail(options);
  }
}

export const emailAgent = new EmailAgent();
export default emailAgent;

