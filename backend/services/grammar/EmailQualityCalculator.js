/**
 * Calculates overall email quality score combining grammar, tone, readability, formatting, and completeness.
 */
export class EmailQualityCalculator {
  /**
   * Calculates overall email quality score out of 100.
   */
  static calculateQualityScore(text, grammarScore, counts) {
    if (!text || text.trim().length === 0) return 0;

    // 1. Grammar Component (Max 40 Marks)
    const grammarMarks = Math.round((grammarScore / 100) * 40);

    // 2. Professional Tone Component (Max 20 Marks)
    let toneMarks = 20;
    if (/\b(gonna|wanna|pls|thx|dude|sup|lol)\b/i.test(text)) {
      toneMarks -= 6;
    }
    if (!/^(dear|hi|hello|good morning|good afternoon)/i.test(text.trim())) {
      toneMarks -= 4;
    }

    // 3. Readability Component (Max 15 Marks)
    const words = text.split(/\s+/).filter(Boolean).length;
    let readabilityMarks = 15;
    if (words > 250) readabilityMarks -= 3;
    if (counts.sentenceStructureIssues > 0) readabilityMarks -= (counts.sentenceStructureIssues * 2);
    readabilityMarks = Math.max(5, readabilityMarks);

    // 4. Formatting Component (Max 10 Marks)
    let formattingMarks = 10;
    if (words > 100 && !text.includes('\n')) formattingMarks -= 5;
    if (counts.punctuationErrors > 0) formattingMarks -= Math.min(4, counts.punctuationErrors);

    // 5. Completeness Component (Max 15 Marks)
    let completenessMarks = 15;
    if (!/(regards|sincerely|best|thank you|thanks),/i.test(text)) completenessMarks -= 4;
    if (words < 15) completenessMarks -= 5;

    const total = Math.max(20, Math.min(100, grammarMarks + toneMarks + readabilityMarks + formattingMarks + completenessMarks));
    return total;
  }
}

export default EmailQualityCalculator;
