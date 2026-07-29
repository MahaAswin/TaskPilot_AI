/**
 * Data Transfer Object representing complete grammar inspection results.
 */
export class GrammarResponseDTO {
  constructor({
    grammarScore = 100,
    writingQualityCategory = 'Excellent',
    writingLevel = 'Professional',
    overallEmailQualityScore = 95,
    counts = {
      grammarErrors: 0,
      spellingErrors: 0,
      punctuationErrors: 0,
      styleSuggestions: 0,
      sentenceStructureIssues: 0,
      capitalizationIssues: 0,
      repeatedWords: 0,
      passiveVoice: 0,
      totalIssues: 0
    },
    issues = [],
    assessmentFeedback = '',
    available = true
  }) {
    this.grammarScore = grammarScore;
    this.writingQualityCategory = writingQualityCategory;
    this.writingLevel = writingLevel;
    this.overallEmailQualityScore = overallEmailQualityScore;
    this.counts = counts;
    this.issues = issues;
    this.assessmentFeedback = assessmentFeedback;
    this.available = available;
  }
}

export default GrammarResponseDTO;
