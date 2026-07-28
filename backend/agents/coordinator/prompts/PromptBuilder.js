export class PromptBuilder {
  /**
   * Compose contextualized agent prompts.
   * @param {string} prompt - User query input
   * @param {Object} [context] - Context parameters
   * @param {Array<Object>} [context.history] - Chat history logs
   * @param {Object} [context.workspace] - Active workspace metadata
   * @param {Object} [context.preferences] - User configuration settings
   * @returns {Object} Structured final prompt block
   */
  static build(prompt, context = {}) {
    const history = context.history || [];
    const workspace = context.workspace || { title: 'General Sandbox' };
    const preferences = context.preferences || { theme: 'light' };

    // Format chat history log strings
    const historyStr = history
      .map(msg => `${msg.sender === 'user' ? 'Operator' : 'AI'}: ${msg.content}`)
      .join('\n');

    const systemPrompt = `[COORDINATOR CONFIGURATION]
You are a specialized sub-agent in the TaskPilot AI Multi-Agent Operating System.
- Workspace: ${workspace.title}
- User preferences: Theme is ${preferences.theme}

INSTRUCTIONS:
Solve the operator's prompt below. Return structured, premium markdown formatting.
Include tables, lists, and clear explanations where appropriate.`;

    const fullPromptText = `${systemPrompt}

[CONVERSATION HISTORY]
${historyStr || 'No history recorded.'}

[OPERATOR PROMPT]
${prompt}`;

    return {
      systemPrompt,
      userPrompt: prompt,
      fullPromptText,
      meta: {
        workspaceTitle: workspace.title,
        historyCount: history.length
      }
    };
  }
}

export default PromptBuilder;
