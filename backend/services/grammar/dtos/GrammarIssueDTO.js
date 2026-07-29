/**
 * Data Transfer Object representing a single parsed grammar or writing issue.
 */
export class GrammarIssueDTO {
  constructor({
    originalText = '',
    correctedText = '',
    category = 'Grammar',
    explanation = '',
    example = '',
    severity = 1,
    offset = 0,
    length = 0
  }) {
    this.originalText = originalText;
    this.correctedText = correctedText;
    this.category = category;
    this.explanation = explanation;
    this.example = example;
    this.severity = severity;
    this.offset = offset;
    this.length = length;
  }
}

export default GrammarIssueDTO;
