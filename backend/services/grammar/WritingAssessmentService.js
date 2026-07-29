/**
 * Formulates non-judgmental, constructive professional writing assessment and explanations.
 */
export class WritingAssessmentService {
  /**
   * Generates constructive assessment summary text.
   */
  static generateAssessment(score, counts, category) {
    if (score >= 90) {
      return 'Excellent professional email with strong grammar, clear structure, and appropriate business tone.';
    }
    if (score >= 75) {
      return 'Good email composition with minor grammar or punctuation refinements recommended.';
    }
    if (score >= 60) {
      return `Several writing refinements identified (${counts.grammarErrors} grammar, ${counts.spellingErrors} spelling). sentence structure and prepositions can be enhanced.`;
    }
    return 'Multiple language and formatting issues detected. Polishing the sentence flow and tone will significantly enhance readability.';
  }

  /**
   * Generates simple-language explanation for why a fix was suggested.
   */
  static getSimpleExplanation(originalText, fix, category) {
    if (category === 'Spelling') {
      return `Spelling correction for "${originalText}".`;
    }
    if (category === 'Grammar') {
      if (/your doing/i.test(originalText)) {
        return 'Use "you\'re" (you are) instead of the possessive pronoun "your".';
      }
      if (/interested for/i.test(originalText)) {
        return 'The adjective "interested" pairs with the preposition "in".';
      }
      return `Replace "${originalText}" with "${fix}" to maintain standard subject-verb or preposition agreement.`;
    }
    if (category === 'Style & Tone') {
      return `Informal word "${originalText}" detected; replace with standard business term "${fix}".`;
    }
    return `Revise "${originalText}" to "${fix}" for optimal readability.`;
  }
}

export default WritingAssessmentService;
