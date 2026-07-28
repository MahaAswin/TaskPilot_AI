import Task from '../models/Task.js';
import llmService from '../services/llmService.js';

class TaskAgent {
  getDescription() {
    return 'Specialist in task lifecycle management. Responsible for creating, updating, completing, deleting, and listing tasks, as well as providing smart task recommendations.';
  }

  /**
   * Run the Task Agent.
   * @param {string} prompt - User request
   * @param {object} context - User context (userId, name, etc.)
   * @returns {Promise<string>} Agent response detailing actions taken
   */
  async run(prompt, context) {
    const userId = context.user?._id;
    if (!userId) {
      return '### Task Agent Error\nNo user context provided. Please authenticate to manage tasks.';
    }

    try {
      // 1. Fetch current user's tasks for context
      const existingTasks = await Task.find({ user: userId, status: { $ne: 'completed' } }).limit(10);
      const tasksSummary = existingTasks.map(t => `ID: ${t._id}, Title: "${t.title}", Status: "${t.status}", Due: "${t.dueDate.toISOString().split('T')[0]}", Priority: "${t.priority}"`).join('\n');

      // 2. Query LLM to parse intent and details
      const parsingSystemPrompt = `You are the Task Agent of TaskPilot AI.
Analyze the user's request and match it against the following actions:
- "create": user wants to add a new task (e.g. "Add a task to submit report")
- "complete": user wants to check off or finish a task (e.g. "Complete task buying milk" or "Finish my homework task")
- "delete": user wants to remove/delete a task
- "list": user wants to see their current tasks
- "none": user is just chatting or asking general productivity advice

Here are the user's current active tasks:
${tasksSummary || 'No active tasks found.'}

You must respond ONLY with a valid JSON object matching this schema:
{
  "action": "create" | "complete" | "delete" | "list" | "none",
  "taskDetails": {
    "title": "Title of the task",
    "description": "Optional description details",
    "dueDate": "ISO Date String (default to 24h from now if not specified)",
    "priority": "low" | "medium" | "high",
    "category": "Work" | "Study" | "Personal" | "General"
  },
  "targetTaskId": "MongoDB ObjectId of the matching task from the list above, if completing/deleting/updating",
  "explanation": "A concise, professional statement explaining what you are doing (e.g. 'I will create a task for your project submission due tomorrow.')"
}

Do not include any Markdown wrap in your response, just return the raw JSON string.`;

      const aiResponseText = await llmService.generateCompletion([
        { role: 'system', content: parsingSystemPrompt },
        { role: 'user', content: prompt }
      ]);

      // Parse JSON
      let intent;
      try {
        // Clean markdown backticks if any
        const cleanedText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
        intent = JSON.parse(cleanedText);
      } catch (err) {
        console.error('[Task Agent] Failed to parse JSON intent:', aiResponseText);
        // Heuristic fallback
        intent = { action: 'none', explanation: 'Let me help you check your dashboard for active tasks.' };
      }

      let resultMsg = `### 📋 Task Manager Agent\n\n*Agent Reasoning: ${intent.explanation}*\n\n`;

      if (intent.action === 'create') {
        const { title, description, dueDate, priority, category } = intent.taskDetails || {};
        if (!title) {
          return `${resultMsg}❌ Error: Could not determine the task title. Please specify what task you want to create.`;
        }

        const newTask = await Task.create({
          user: userId,
          title,
          description: description || '',
          dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 24 * 60 * 60 * 1000),
          priority: priority || 'medium',
          category: category || 'General',
          status: 'pending'
        });

        resultMsg += `✅ **Task Created Successfully!**\n- **Title:** ${newTask.title}\n- **Priority:** \`${newTask.priority.toUpperCase()}\`\n- **Category:** ${newTask.category}\n- **Due Date:** ${newTask.dueDate.toLocaleDateString()}`;
      } 
      
      else if (intent.action === 'complete') {
        let taskId = intent.targetTaskId;
        
        // If LLM couldn't find ID but the user specified a name, try searching MongoDB
        if (!taskId && intent.taskDetails?.title) {
          const matchingTask = await Task.findOne({
            user: userId,
            title: { $regex: new RegExp(intent.taskDetails.title, 'i') },
            status: { $ne: 'completed' }
          });
          if (matchingTask) taskId = matchingTask._id;
        }

        if (!taskId) {
          return `${resultMsg}🔍 I couldn't find a matching active task to complete. Here are your active tasks:\n\n${tasksSummary || 'No active tasks.'}`;
        }

        const updatedTask = await Task.findOneAndUpdate(
          { _id: taskId, user: userId },
          { status: 'completed', completedAt: new Date() },
          { new: true }
        );

        if (updatedTask) {
          resultMsg += `✔️ **Task Marked as Completed!**\n- **Title:** ${updatedTask.title}\n- **Completed At:** ${updatedTask.completedAt.toLocaleDateString()}`;
        } else {
          resultMsg += `❌ Task with ID \`${taskId}\` was not found.`;
        }
      } 
      
      else if (intent.action === 'delete') {
        let taskId = intent.targetTaskId;
        if (!taskId && intent.taskDetails?.title) {
          const matchingTask = await Task.findOne({
            user: userId,
            title: { $regex: new RegExp(intent.taskDetails.title, 'i') }
          });
          if (matchingTask) taskId = matchingTask._id;
        }

        if (!taskId) {
          return `${resultMsg}🔍 I couldn't find that task. Please check your tasks dashboard.`;
        }

        const deletedTask = await Task.findOneAndDelete({ _id: taskId, user: userId });
        if (deletedTask) {
          resultMsg += `🗑️ **Task Deleted:** "${deletedTask.title}"`;
        } else {
          resultMsg += `❌ Failed to delete task. ID not found.`;
        }
      } 
      
      else if (intent.action === 'list') {
        const allTasks = await Task.find({ user: userId }).sort({ status: 1, dueDate: 1 });
        if (allTasks.length === 0) {
          resultMsg += `💡 You don't have any tasks logged yet! Add a new task by typing something like "Add a study task for biology".`;
        } else {
          resultMsg += `Here is your current task list:\n\n`;
          allTasks.forEach((t, i) => {
            const statusIcon = t.status === 'completed' ? '✅' : '⏳';
            const priorityBadge = `\`${t.priority.toUpperCase()}\``;
            resultMsg += `${i + 1}. ${statusIcon} **${t.title}** (${t.category}) - Priority: ${priorityBadge} | Due: ${t.dueDate.toLocaleDateString()}\n`;
          });
        }
      } 
      
      else {
        // Just recommendation mode
        const allTasks = await Task.find({ user: userId });
        const pendingCount = allTasks.filter(t => t.status !== 'completed').length;
        resultMsg += `You currently have **${pendingCount} pending tasks**. Based on your productivity cycles, I recommend tackling high-priority items first to boost your overall completion score.`;
      }

      return resultMsg;
    } catch (error) {
      console.error('[Task Agent] Error:', error);
      return `### Task Manager Error\nFailed to handle task request. Reason: ${error.message}`;
    }
  }
}

export default TaskAgent;
