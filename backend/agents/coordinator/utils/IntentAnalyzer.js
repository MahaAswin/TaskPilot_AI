import { IntentType } from '../types/CoordinatorTypes.js';

export class IntentAnalyzer {
  /**
   * Parse user query inputs and resolve matching categories.
   * Supports multi-intent category parsing.
   * @param {string} prompt - User text prompt input
   * @returns {string[]} Detected intent categories list
   */
  static analyze(prompt) {
    if (!prompt) return [IntentType.GENERAL_QUERY];

    const tokens = prompt.toLowerCase();
    const intents = new Set();

    // 1. Email Matches
    if (
      tokens.includes('email') ||
      tokens.includes('mail') ||
      tokens.includes('gmail') ||
      tokens.includes('send email') ||
      tokens.includes('compose email') ||
      tokens.includes('draft email') ||
      tokens.includes('recipient')
    ) {
      intents.add(IntentType.EMAIL);
    }

    // 2. Security Matches
    if (
      tokens.includes('security') ||
      tokens.includes('virus') ||
      tokens.includes('phishing') ||
      tokens.includes('malware') ||
      tokens.includes('url check') ||
      tokens.includes('link check') ||
      tokens.includes('virustotal') ||
      tokens.includes('urlscan') ||
      tokens.includes('threat') ||
      tokens.includes('scan url') ||
      tokens.includes('scan link') ||
      tokens.includes('vulnerability') ||
      tokens.includes('spam')
    ) {
      intents.add(IntentType.SECURITY);
    }

    // 3. Calendar Matches
    if (
      tokens.includes('calendar') ||
      tokens.includes('event') ||
      tokens.includes('appointment') ||
      tokens.includes('schedule meeting') ||
      tokens.includes('meeting')
    ) {
      intents.add(IntentType.CALENDAR);
    }

    // 4. Quiz Matches
    if (
      tokens.includes('quiz') ||
      tokens.includes('test') ||
      tokens.includes('flashcard') ||
      tokens.includes('flash card') ||
      tokens.includes('exam')
    ) {
      intents.add(IntentType.QUIZ);
    }

    // 5. Roadmap Matches
    if (
      tokens.includes('roadmap') ||
      tokens.includes('timeline') ||
      tokens.includes('milestone') ||
      (tokens.includes('plan') && !tokens.includes('study plan') && !tokens.includes('calendar'))
    ) {
      intents.add(IntentType.ROADMAP);
    }

    // 6. Study Notes Matches
    if (
      tokens.includes('notes') ||
      tokens.includes('explain') ||
      tokens.includes('study') ||
      tokens.includes('research') ||
      tokens.includes('define') ||
      tokens.includes('concept') ||
      tokens.includes('summary')
    ) {
      intents.add(IntentType.STUDY_NOTES);
    }

    // 7. Task Matches
    if (
      tokens.includes('task') ||
      tokens.includes('todo') ||
      tokens.includes('to-do') ||
      tokens.includes('checklist')
    ) {
      intents.add(IntentType.TASK);
    }

    // 8. Creative Matches
    if (
      tokens.includes('diagram') ||
      tokens.includes('mindmap') ||
      tokens.includes('mind map') ||
      tokens.includes('flowchart') ||
      tokens.includes('creative')
    ) {
      intents.add(IntentType.CREATIVE);
    }

    // 9. Productivity Matches
    if (
      tokens.includes('metric') ||
      tokens.includes('score') ||
      tokens.includes('coach')
    ) {
      intents.add(IntentType.PRODUCTIVITY);
    }

    // 10. Skill Analysis Matches
    if (
      tokens.includes('skill') ||
      tokens.includes('competency')
    ) {
      intents.add(IntentType.SKILL_ANALYSIS);
    }

    // Fallback: If no specific keywords matched, default to GENERAL_QUERY
    if (intents.size === 0) {
      intents.add(IntentType.GENERAL_QUERY);
    }

    return Array.from(intents);
  }
}

export default IntentAnalyzer;
