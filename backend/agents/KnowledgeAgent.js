import Note from '../models/Note.js';
import llmService from '../services/llmService.js';

class KnowledgeAgent {
  getDescription() {
    return 'Academic companion. Specializes in summarizing long documents, explaining scientific or technical concepts, generating quiz questions for self-testing, and logging study notes.';
  }

  /**
   * Run the Knowledge Agent.
   * @param {string} prompt - User request
   * @param {object} context - User context
   * @returns {Promise<string>} Agent response
   */
  async run(prompt, context) {
    const userId = context.user?._id;

    const systemPrompt = `You are the Knowledge Agent, a specialized academic assistant in TaskPilot AI.
Your tasks include explaining concepts, summarizing materials, generating multiple-choice practice quizzes, and providing bullet-point takeaways.
Structure your answers with:
1. Clear conceptual breakdowns.
2. Formatted practice questions (if relevant or requested).
3. If the user requests to save this note/summary, confirm you will save it.

User prompt: "${prompt}"`;

    try {
      const response = await llmService.generateCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ]);

      // If user asks to "save note" or "create a note", we can save a note to MongoDB automatically!
      const lowerPrompt = prompt.toLowerCase();
      if (userId && (lowerPrompt.includes('save note') || lowerPrompt.includes('create a note') || lowerPrompt.includes('save this note') || lowerPrompt.includes('save summary'))) {
        // Extract a title using simple extraction or LLM
        let title = 'Study Note - ' + new Date().toLocaleDateString();
        const titleMatch = prompt.match(/(?:title|name|called)\s+["']?([^"'\n]+)["']?/i);
        if (titleMatch && titleMatch[1]) {
          title = titleMatch[1];
        }

        // Clean the markdown content slightly to save it
        const note = await Note.create({
          user: userId,
          title,
          content: response,
          tags: ['AI-Generated', 'KnowledgeBase']
        });

        return `${response}\n\n---\n💾 *Knowledge Agent Note: This explanation has been auto-saved to your notes list as "${note.title}".*`;
      }

      return response;
    } catch (error) {
      return `### Knowledge Agent Error\nFailed to answer the concept explanation. Reason: ${error.message}`;
    }
  }
}

export default KnowledgeAgent;
