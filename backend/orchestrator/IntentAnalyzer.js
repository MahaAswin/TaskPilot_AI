// Orchestration Core: Intent Analyzer (Rule-Based Structured Intent Parser)

export class IntentAnalyzer {
  /**
   * Analyze goal text and resolve intent category and target agents
   * @param {string} goal 
   * @returns {object} Extracted Intent payload
   */
  static analyze(goal = '') {
    const text = goal.toLowerCase();

    if (text.includes('master java') || text.includes('dsa') || text.includes('placement')) {
      return {
        intent: 'Learning & Planning',
        workflowType: 'Sequential Multi-Agent',
        agents: ['Coordinator Agent', 'Planner Agent', 'Knowledge Agent', 'Learning Agent', 'Task Agent', 'Skill Analyzer Agent', 'Productivity Coach Agent']
      };
    }

    if (text.includes('notes') || text.includes('cheatsheet')) {
      return {
        intent: 'Knowledge Generation',
        workflowType: 'Parallel Multi-Agent',
        agents: ['Coordinator Agent', 'Knowledge Agent', 'Creative Agent', 'Learning Agent']
      };
    }

    return {
      intent: 'Multi-Agent General Goal',
      workflowType: 'Sequential Multi-Agent',
      agents: ['Coordinator Agent', 'Planner Agent', 'Task Agent', 'Knowledge Agent']
    };
  }
}

export default IntentAnalyzer;
