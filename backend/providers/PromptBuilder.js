// Prompt Builder Engine

export class PromptBuilder {
  static buildPrompt({ systemPrompt, agentPrompt, contextPrompt, conversationHistory, userInput }) {
    const parts = [];

    if (systemPrompt) parts.push(`System: ${systemPrompt}`);
    if (agentPrompt) parts.push(`Agent Persona: ${agentPrompt}`);
    if (contextPrompt) parts.push(`Shared Context: ${contextPrompt}`);
    if (conversationHistory && conversationHistory.length > 0) {
      parts.push(`History: ${conversationHistory.map(h => `${h.role}: ${h.content}`).join('\n')}`);
    }
    if (userInput) parts.push(`User Goal: ${userInput}`);

    return parts.join('\n\n');
  }
}

export default PromptBuilder;
