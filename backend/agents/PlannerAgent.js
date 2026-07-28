import llmService from '../services/llmService.js';

class PlannerAgent {
  getDescription() {
    return 'Specialist in daily planning, study guides, long-term learning roadmaps, schedules, timetables, and timelines.';
  }

  /**
   * Run the Planner Agent.
   * @param {string} prompt - User request
   * @param {object} context - User context (existing tasks, info)
   * @returns {Promise<string>} Agent response
   */
  async run(prompt, context) {
    const systemPrompt = `You are the Planner Agent, a core sub-agent of TaskPilot AI.
Your expertise is in structuring schedules, roadmaps, study plans, and timelines.
When the user asks for a plan, roadmap, or timetable:
1. Provide a beautiful, highly-structured markdown roadmap or calendar.
2. Use clear section headers (### Phase 1, ### Day 1, etc.).
3. Add estimated times, milestone highlights, and concrete actionable tasks.
4. Keep the writing premium, clean, and highly encouraging.

User prompt: "${prompt}"
Context: User name is "${context.user?.name || 'User'}". Current time is ${new Date().toLocaleDateString()}.`;

    try {
      const response = await llmService.generateCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ]);
      return response;
    } catch (error) {
      return `### Planner Error\nFailed to compile planning roadmap. Reason: ${error.message}`;
    }
  }
}

export default PlannerAgent;
