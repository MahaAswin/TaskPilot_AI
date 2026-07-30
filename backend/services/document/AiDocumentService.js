import { aiService } from '../aiService.js';

export class AiDocumentService {
  /**
   * Enhances text content using Gemini 2.5 Flash / TaskPilot AI Provider Chain.
   * @param {string} text 
   * @param {string} enhancementType 
   * @returns {Promise<string>}
   */
  static async enhanceContent(text = '', enhancementType = null) {
    if (!enhancementType || !text || text.trim() === '') {
      return text;
    }

    const prompts = {
      grammar: `Improve the grammar, spelling, punctuation, and clarity of the following text while preserving its core meaning:\n\n${text}`,
      rewrite: `Provide a sleek, professional executive rewrite of the following text:\n\n${text}`,
      summarize: `Summarize the following text into key bullet points and executive summary:\n\n${text}`,
      expand: `Expand the following text with detailed explanations, technical context, and examples:\n\n${text}`,
      formal: `Rewrite the following text in an authoritative, formal corporate tone:\n\n${text}`,
      friendly: `Rewrite the following text in a warm, friendly, and approachable tone:\n\n${text}`,
      business_letter: `Convert the following content into a formal Business Letter format complete with Date, Subject, Salutation, and Sign-off:\n\n${text}`,
      meeting_minutes: `Format the following text into structured Meeting Minutes with Attendees, Agenda, Discussion Points, and Action Items:\n\n${text}`,
      technical_doc: `Format the following text as Technical Documentation with Overview, Specifications, Architecture, and Key Operations:\n\n${text}`,
      academic_report: `Format the following text into an Academic Report structure with Abstract, Introduction, Methodology, Findings, and Conclusion:\n\n${text}`,
      resume: `Format the following details into a clean Professional Resume structure with Summary, Skills, Experience, and Education:\n\n${text}`,
      report: `Convert the following content into a comprehensive Executive Business Report with Title, Executive Summary, Key Findings, and Strategic Recommendations:\n\n${text}`
    };

    const prompt = prompts[enhancementType.toLowerCase()] || `Improve and refine the following document content:\n\n${text}`;

    try {
      const result = await aiService.chat([{ role: 'user', content: prompt }], { agent: 'Document Generator Agent' });
      return result.content || result.response || result.text || text;
    } catch (error) {
      console.warn('[AiDocumentService] AI enhancement error, falling back to original text:', error?.message);
      return text;
    }
  }
}

export default AiDocumentService;
