import LanguageToolClient from './LanguageToolClient.js';
import GrammarIssueDTO from './dtos/GrammarIssueDTO.js';
import GrammarResponseDTO from './dtos/GrammarResponseDTO.js';
import EmailQualityCalculator from './EmailQualityCalculator.js';
import WritingAssessmentService from './WritingAssessmentService.js';

export class GrammarService {
  /**
   * Main entry point to analyze grammar and quality.
   */
  static async analyze(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new GrammarResponseDTO({ available: true });
    }

    const cleanText = text.trim();

    // 1. Fetch raw matches from LanguageToolClient
    const { matches, available } = await LanguageToolClient.checkGrammar(cleanText);

    if (!available) {
      return new GrammarResponseDTO({
        available: false,
        assessmentFeedback: 'Grammar analysis temporarily unavailable.'
      });
    }

    // 2. Parse matches into GrammarIssueDTOs & counts
    const parsedIssues = [];
    const counts = {
      grammarErrors: 0,
      spellingErrors: 0,
      punctuationErrors: 0,
      styleSuggestions: 0,
      sentenceStructureIssues: 0,
      capitalizationIssues: 0,
      repeatedWords: 0,
      passiveVoice: 0,
      totalIssues: 0
    };

    const seenErrors = new Set();

    matches.forEach(m => {
      const errText = cleanText.substring(m.offset, m.offset + m.length);
      if (!errText || seenErrors.has(errText.toLowerCase())) return;
      seenErrors.add(errText.toLowerCase());

      const replacement = m.replacements && m.replacements.length > 0 ? m.replacements[0].value : '';
      const categoryId = m.rule?.category?.id || '';
      const ruleId = m.rule?.id || '';

      let category = 'Grammar';
      let severity = 3;

      if (categoryId === 'TYPOS' || categoryId === 'SPELLING' || ruleId.includes('MORFOLOGIK')) {
        category = 'Spelling';
        severity = 2;
        counts.spellingErrors++;
      } else if (categoryId === 'PUNCTUATION') {
        category = 'Punctuation';
        severity = 1;
        counts.punctuationErrors++;
      } else if (categoryId === 'CASING' || ruleId.includes('CAPITALIZATION')) {
        category = 'Capitalization';
        severity = 1;
        counts.capitalizationIssues++;
      } else if (categoryId === 'STYLE' || categoryId === 'COLLOCATIONS') {
        category = 'Style & Tone';
        severity = 2;
        counts.styleSuggestions++;
      } else {
        counts.grammarErrors++;
      }

      const explanation = WritingAssessmentService.getSimpleExplanation(errText, replacement, category);
      const exampleText = replacement ? `${errText} → ${replacement}` : errText;

      parsedIssues.push(new GrammarIssueDTO({
        originalText: errText,
        correctedText: replacement || errText,
        category,
        explanation: m.message || explanation,
        example: exampleText,
        severity,
        offset: m.offset,
        length: m.length
      }));
    });

    // 3. Heuristic checks for passive voice, repeated words, long sentences
    const passivePattern = /\b(am|is|are|was|were|been|being|be)\s+([a-z]+ed|[a-z]+en)\b/gi;
    let match;
    while ((match = passivePattern.exec(cleanText)) !== null) {
      if (counts.passiveVoice >= 2) break;
      const phrase = match[0];
      if (!seenErrors.has(phrase.toLowerCase())) {
        seenErrors.add(phrase.toLowerCase());
        counts.passiveVoice++;
        parsedIssues.push(new GrammarIssueDTO({
          originalText: phrase,
          correctedText: 'active voice phrasing',
          category: 'Passive Voice',
          explanation: 'Passive voice reduces sentence directness in business emails.',
          example: `${phrase} (passive)`,
          severity: 2
        }));
      }
    }

    counts.totalIssues = parsedIssues.length;

    // 4. Calculate Dynamic Grammar Score (0–100)
    let deductions = (counts.grammarErrors * 4) + (counts.spellingErrors * 2) + (counts.punctuationErrors * 1) + (counts.styleSuggestions * 2) + (counts.passiveVoice * 2);
    let grammarScore = Math.max(35, Math.min(100, Math.round(100 - deductions)));

    // Categorize Writing Quality & Writing Level
    let writingQualityCategory = 'Good';
    if (grammarScore >= 95) writingQualityCategory = 'Excellent';
    else if (grammarScore >= 75) writingQualityCategory = 'Good';
    else if (grammarScore >= 60) writingQualityCategory = 'Needs Improvement';
    else writingQualityCategory = 'Poor';

    let writingLevel = 'Professional';
    if (grammarScore >= 94) writingLevel = 'Excellent';
    else if (grammarScore >= 80) writingLevel = 'Professional';
    else if (grammarScore >= 65) writingLevel = 'Intermediate';
    else writingLevel = 'Beginner';

    // 5. Calculate Overall Email Quality Score
    const overallEmailQualityScore = EmailQualityCalculator.calculateQualityScore(cleanText, grammarScore, counts);

    // 6. Generate Feedback
    const assessmentFeedback = WritingAssessmentService.generateAssessment(grammarScore, counts, writingQualityCategory);

    return new GrammarResponseDTO({
      grammarScore,
      writingQualityCategory,
      writingLevel,
      overallEmailQualityScore,
      counts,
      issues: parsedIssues,
      assessmentFeedback,
      available: true
    });
  }
}

export default GrammarService;
