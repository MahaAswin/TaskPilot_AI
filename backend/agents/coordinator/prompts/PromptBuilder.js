export class PromptBuilder {
  /**
   * Compose streamlined agent prompts to optimize Ollama and LLM latency.
   * @param {string} prompt - User query input
   * @param {Object} [context] - Context parameters
   * @returns {Object} Structured final prompt block
   */
  static build(prompt, context = {}) {
    const history = context.history || [];
    // Keep only last 4 messages to prevent prompt bloat and timeout
    const recentHistory = history.slice(-4);
    
    const historyStr = recentHistory
      .map(msg => `${msg.sender === 'user' || msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const systemPrompt = `You are a helpful AI assistant. Provide a clear, concise, structured response in Markdown.`;

    const parts = [systemPrompt];
    if (historyStr) {
      parts.push(`[CONVERSATION HISTORY]\n${historyStr}`);
    }
    parts.push(`[USER PROMPT]\n${prompt}`);

    const fullPromptText = parts.join('\n\n');

    return {
      systemPrompt,
      userPrompt: prompt,
      fullPromptText,
      meta: {
        historyCount: recentHistory.length
      }
    };
  }
}

export default PromptBuilder;
