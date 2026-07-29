import { AgentType } from '../types/CoordinatorTypes.js';

export class ResponseMerger {
  /**
   * Merge responses from executed agents.
   * @param {Array<{agentName: string, content: string}>} responses - Outputs from sub-agents
   * @returns {string} Fully aggregated markdown string
   */
  static merge(responses) {
    if (!responses || responses.length === 0) {
      return 'The AI service is currently unavailable. Please try again in a moment.';
    }

    const validContents = responses
      .map(r => typeof r === 'string' ? r : r.content)
      .filter(c => Boolean(c && String(c).trim()));

    if (validContents.length === 0) {
      return 'The AI service returned no output. Please try rephrasing your request.';
    }

    return validContents.join('\n\n---\n\n');
  }

  /**
   * Helper to return clean markdown banners based on agent identity.
   */
  static getAgentMarkdownHeader(agentName) {
    switch (agentName) {
      case AgentType.KNOWLEDGE:
        return '#### 📚 Knowledge Core notes';
      case AgentType.PLANNER:
        return '#### 📅 Strategic Plan Roadmap';
      case AgentType.TASK:
        return '#### 📝 Active Tasks Board';
      case AgentType.LEARNING:
        return '#### 🧠 Academy Flashcards & Quiz';
      case AgentType.CREATIVE:
        return '#### 🎨 Mindmap & Diagrams schematic';
      case AgentType.SKILL_ANALYZER:
        return '#### 🔬 Skills Profile Analysis';
      case AgentType.PRODUCTIVITY_COACH:
        return '#### 📈 Coach Performance recommendations';
      default:
        return `#### 🤖 ${agentName} output`;
    }
  }
}

export default ResponseMerger;
