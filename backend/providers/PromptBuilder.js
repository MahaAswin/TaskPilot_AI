// Centralized Prompt Builder Engine for TaskPilot AI Providers

export class PromptBuilder {
  /**
   * Build formatted prompt payload for Gemini and future providers
   */
  static buildPrompt({ systemPrompt, agentPrompt, contextPrompt, conversationHistory, userInput }) {
    const parts = [];

    if (systemPrompt) parts.push(`[SYSTEM PROMPT]\n${systemPrompt}`);
    if (agentPrompt) parts.push(`[AGENT PERSONA]\n${agentPrompt}`);
    if (contextPrompt) parts.push(`[SHARED CONTEXT]\n${contextPrompt}`);
    if (conversationHistory && conversationHistory.length > 0) {
      const historyStr = conversationHistory.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n');
      parts.push(`[CONVERSATION HISTORY]\n${historyStr}`);
    }
    if (userInput) parts.push(`[USER REQUEST]\n${userInput}`);

    return parts.join('\n\n');
  }

  // Pre-configured optimized prompt templates for AI task types

  static notesPrompt(topic) {
    return `Generate comprehensive, structured learning notes for the topic: "${topic}".
Include:
1. Executive Summary
2. Core Concepts Breakdown
3. Key Technical Details
4. Real-world Code/Use Case Example
5. 3 Key Takeaways

Format your response cleanly in GitHub-Flavored Markdown.`;
  }

  static quizPrompt(topic) {
    return `Generate a 5-question multiple-choice quiz on the topic: "${topic}".
Return ONLY a valid JSON array of objects with NO additional markdown wrapping or conversational text.
JSON Structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0,
    "explanation": "Why this option is correct"
  }
]`;
  }

  static flashcardsPrompt(topic) {
    return `Generate a set of 5 flashcards for mastering: "${topic}".
Return ONLY a valid JSON array of objects with NO additional markdown wrapping or conversational text.
JSON Structure:
[
  {
    "front": "Concept or Question on front",
    "back": "Clear explanation or answer on back",
    "category": "Core Concept"
  }
]`;
  }

  static studyPlanPrompt(topic) {
    return `Generate a structured 4-week study plan to master: "${topic}".
Return ONLY a valid JSON object with NO additional markdown wrapping or conversational text.
JSON Structure:
{
  "topic": "${topic}",
  "duration": "4 Weeks",
  "weeklyPlan": [
    {
      "week": 1,
      "title": "Foundations & Core Principles",
      "goals": ["Goal 1", "Goal 2"],
      "dailyHours": 2
    }
  ]
}`;
  }

  static roadmapPrompt(goal) {
    return `Create a step-by-step career/skill roadmap for the goal: "${goal}".
Return ONLY a valid JSON object with NO additional markdown wrapping or conversational text.
JSON Structure:
{
  "goal": "${goal}",
  "milestones": [
    {
      "step": 1,
      "title": "Phase Title",
      "description": "Description of what to accomplish",
      "estimatedDays": 14,
      "recommendedResources": ["Resource 1", "Resource 2"]
    }
  ]
}`;
  }

  static tasksPrompt(goal) {
    return `Generate 5 actionable daily tasks to achieve the goal: "${goal}".
Return ONLY a valid JSON array of objects with NO additional markdown wrapping or conversational text.
JSON Structure:
[
  {
    "title": "Specific Task Title",
    "category": "Learning / Coding / Practice",
    "priority": "High / Medium / Low",
    "estimatedMinutes": 45,
    "xpReward": 50
  }
]`;
  }

  static interviewPrompt(topic) {
    return `Generate 5 technical interview questions with model answers for: "${topic}".
Return ONLY a valid JSON array of objects with NO additional markdown wrapping or conversational text.
JSON Structure:
[
  {
    "question": "Interview question here?",
    "difficulty": "Easy / Medium / Hard",
    "modelAnswer": "Comprehensive technical answer",
    "keyKeywords": ["Keyword1", "Keyword2"]
  }
]`;
  }

  static diagramPrompt(topic) {
    return `Create a Mermaid flowchart visual diagram illustrating: "${topic}".
Return ONLY raw Mermaid syntax starting with 'graph TD;' or 'graph LR;'.
Do NOT wrap in markdown codeblocks (no \`\`\`mermaid). Return pure text syntax only.`;
  }

  static mindmapPrompt(topic) {
    return `Create a hierarchical mind map structure for: "${topic}".
Return ONLY a valid JSON object representing a hierarchical tree with NO additional markdown wrapping.
JSON Structure:
{
  "id": "root",
  "label": "${topic}",
  "children": [
    {
      "id": "sub-1",
      "label": "Main Branch 1",
      "children": [
        { "id": "leaf-1", "label": "Leaf Detail" }
      ]
    }
  ]
}`;
  }

  static summaryPrompt(text) {
    return `Summarize the following content concisely in 3 bullet points:\n\n${text}`;
  }

  static chatPrompt(messages = []) {
    if (!messages) return 'Hello, how can I help you?';
    if (typeof messages === 'string') return messages;
    if (!Array.isArray(messages)) {
      return typeof messages === 'object' ? (messages.content || messages.text || JSON.stringify(messages)) : String(messages);
    }
    if (messages.length === 0) return 'Hello, how can I help you?';
    const history = messages.map(m => {
      if (typeof m === 'string') return m;
      const role = m.role === 'user' ? 'User' : (m.role ? 'Assistant' : 'User');
      const content = m.content || m.text || '';
      return `${role}: ${content}`;
    }).join('\n');
    return `${history}\nAssistant:`;
  }

  static explainPrompt(topic) {
    if (typeof topic === 'string' && (topic.length > 80 || topic.startsWith('Describe') || topic.includes('\n'))) {
      return topic;
    }
    return `Provide a clear, engaging, step-by-step explanation of "${topic}" suitable for a developer.
Use analogies, clear code snippets if applicable, and highlight key takeaways in Markdown.`;
  }
}

export default PromptBuilder;
