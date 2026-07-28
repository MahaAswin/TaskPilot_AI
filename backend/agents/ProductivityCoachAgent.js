import Task from '../models/Task.js';
import User from '../models/User.js';
import Productivity from '../models/Productivity.js';
import llmService from '../services/llmService.js';

class ProductivityCoachAgent {
  getDescription() {
    return 'Productivity consultant. Analyzes task completion ratios, maintains weekly progress scores, suggests habits, and provides daily focus motivation.';
  }

  /**
   * Run the Productivity Coach Agent.
   * @param {string} prompt - User request
   * @param {object} context - User context
   * @returns {Promise<string>} Agent response containing progress analysis
   */
  async run(prompt, context) {
    const userId = context.user?._id;
    if (!userId) {
      return '### Productivity Coach Error\nNo user context provided. Please authenticate to review metrics.';
    }

    try {
      // 1. Query metrics
      const totalTasks = await Task.countDocuments({ user: userId });
      const completedTasks = await Task.countDocuments({ user: userId, status: 'completed' });
      const pendingTasks = totalTasks - completedTasks;

      // Calculate score
      let score = 70; // baseline
      if (totalTasks > 0) {
        score = Math.round((completedTasks / totalTasks) * 100);
      }

      // Update user schema profile score
      await User.findByIdAndUpdate(userId, { productivityScore: score });

      // Save today's log in Productivity schema
      const todayStr = new Date().toISOString().split('T')[0];
      await Productivity.findOneAndUpdate(
        { user: userId, date: todayStr },
        { score, tasksCompletedCount: completedTasks },
        { upsert: true, new: true }
      );

      // 2. Draft coach context for LLM
      const coachingPrompt = `You are the Productivity Coach Agent in TaskPilot AI.
Analyze the user's progress and write a motivational coach report.
Metrics:
- Total Tasks: ${totalTasks}
- Completed Tasks: ${completedTasks}
- Pending Tasks: ${pendingTasks}
- Calculated Score: ${score}%

Provide an structured report:
1. **Performance Evaluation**: Assess their current completion score.
2. **Actionable Suggestions**: Offer 2-3 specific time-management or task-completion tips.
3. **Motivational Closing**: End with a powerful encouraging quote or thought.

User prompt: "${prompt}"`;

      const response = await llmService.generateCompletion([
        { role: 'system', content: coachingPrompt },
        { role: 'user', content: prompt }
      ]);

      const formattedScore = score >= 80 ? `🟢 Excellent (${score}%)` : score >= 50 ? `🟡 Moderate (${score}%)` : `🔴 Focus Needed (${score}%)`;

      return `### ⚡ Productivity Coach Report\n\n**Current Productivity Status:** ${formattedScore}\n- **Completed Tasks:** ${completedTasks} / ${totalTasks}\n\n---\n\n${response}`;
    } catch (error) {
      console.error('[Productivity Coach Agent] Error:', error);
      return `### Productivity Coach Error\nFailed to assemble productivity metrics. Reason: ${error.message}`;
    }
  }
}

export default ProductivityCoachAgent;
