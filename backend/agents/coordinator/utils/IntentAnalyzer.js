import { IntentType } from '../types/CoordinatorTypes.js';

export class IntentAnalyzer {
  /**
   * Parse user query inputs and resolve matching categories.
   * Supports multi-intent category parsing.
   * @param {string} prompt - User text prompt input
   * @returns {string[]} Detected intent categories list
   */
  static analyze(prompt) {
    if (!prompt) return [IntentType.GENERAL_CONVERSATION];

    const tokens = prompt.toLowerCase();
    const intents = new Set();

    // 1. Knowledge Matches
    if (
      tokens.includes('notes') || 
      tokens.includes('explain') || 
      tokens.includes('study') || 
      tokens.includes('research') || 
      tokens.includes('define') ||
      tokens.includes('concept') ||
      tokens.includes('summary')
    ) {
      intents.add(IntentType.KNOWLEDGE);
    }

    // 2. Learning Matches
    if (
      tokens.includes('quiz') || 
      tokens.includes('test') || 
      tokens.includes('flashcard') || 
      tokens.includes('flash card') ||
      tokens.includes('exam') ||
      tokens.includes('question')
    ) {
      intents.add(IntentType.LEARNING);
    }

    // 3. Task Matches
    if (
      tokens.includes('task') || 
      tokens.includes('todo') || 
      tokens.includes('to-do') || 
      tokens.includes('checklist') ||
      tokens.includes('deliverable')
    ) {
      intents.add(IntentType.TASK);
    }

    // 4. Planning Matches
    if (
      tokens.includes('roadmap') || 
      tokens.includes('plan') || 
      tokens.includes('timetable') || 
      tokens.includes('schedule') ||
      tokens.includes('calendar')
    ) {
      intents.add(IntentType.PLANNING);
    }

    // 5. Creative Matches
    if (
      tokens.includes('diagram') || 
      tokens.includes('mindmap') || 
      tokens.includes('mind map') || 
      tokens.includes('flowchart') ||
      tokens.includes('image') ||
      tokens.includes('creative') ||
      tokens.includes('infographic')
    ) {
      intents.add(IntentType.CREATIVE);
    }

    // 6. Productivity Matches
    if (
      tokens.includes('metric') || 
      tokens.includes('score') || 
      tokens.includes('audit') || 
      tokens.includes('tracker') ||
      tokens.includes('coach') ||
      tokens.includes('performance')
    ) {
      intents.add(IntentType.PRODUCTIVITY);
    }

    // 7. Skill Analysis Matches
    if (
      tokens.includes('skill') || 
      tokens.includes('analyze') || 
      tokens.includes('evaluate') || 
      tokens.includes('competency') ||
      tokens.includes('profile')
    ) {
      intents.add(IntentType.SKILL_ANALYSIS);
    }

    // Fallback: If no keywords matched, default to general conversation
    if (intents.size === 0) {
      intents.add(IntentType.GENERAL_CONVERSATION);
    }

    return Array.from(intents);
  }
}

export default IntentAnalyzer;
