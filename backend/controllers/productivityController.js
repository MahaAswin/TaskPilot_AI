import Task from '../models/Task.js';
import Chat from '../models/Chat.js';
import Image from '../models/Image.js';
import Productivity from '../models/Productivity.js';
import User from '../models/User.js';
import productivityCoachAgent from '../agents/ProductivityCoachAgent.js';

// @desc    Get productivity dashboard summary
// @route   GET /api/productivity/dashboard
// @access  Private
export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Determine Greeting
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';

    // 2. Tasks Summary (Due today or pending)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayTasks = await Task.find({
      user: userId,
      dueDate: { $gte: todayStart, $lte: todayEnd }
    });

    const pendingTasksCount = await Task.countDocuments({ user: userId, status: { $ne: 'completed' } });
    const completedTodayCount = todayTasks.filter(t => t.status === 'completed').length;
    const totalTodayCount = todayTasks.length;

    // 3. Recent chats (limit to 5)
    const recentChats = await Chat.find({ user: userId }).sort({ updatedAt: -1 }).limit(5);

    // 4. Recent generated images (limit to 6)
    const recentImages = await Image.find({ user: userId }).sort({ createdAt: -1 }).limit(6);

    // 5. Productivity score historical logs (last 7 logs)
    const historyLogs = await Productivity.find({ user: userId }).sort({ date: -1 }).limit(7);
    // Reverse to show chronologically
    const reversedLogs = historyLogs.reverse();

    // 6. Upcoming due tasks (next 3 days)
    const upcomingTasks = await Task.find({
      user: userId,
      status: { $ne: 'completed' },
      dueDate: { $gt: new Date() }
    }).sort({ dueDate: 1 }).limit(3);

    // 7. Core AI Suggestions (static + dynamic fallback)
    const suggestions = [];
    if (pendingTasksCount > 3) {
      suggestions.push('You have multiple pending tasks. Ask the Coordinator: "Create a study plan for my high-priority items."');
    } else {
      suggestions.push('Your dashboard is clean. Ask the Coordinator: "Generate a futuristic concept design logo" to explore image creation.');
    }
    suggestions.push('Ask the Coach: "Give me feedback on my productivity scores."');

    res.json({
      success: true,
      summary: {
        greeting: `${greeting}, ${req.user.name}`,
        productivityScore: req.user.productivityScore || 70,
        tasks: {
          pending: pendingTasksCount,
          todayTotal: totalTodayCount,
          todayCompleted: completedTodayCount,
        },
        recentChats: recentChats.map(c => ({ _id: c._id, title: c.title, updatedAt: c.updatedAt })),
        recentImages: recentImages.map(img => ({ _id: img._id, url: img.url, prompt: img.prompt })),
        productivityHistory: reversedLogs.map(log => ({ date: log.date, score: log.score, completed: log.tasksCompletedCount })),
        upcomingReminders: upcomingTasks.map(t => ({ _id: t._id, title: t.title, dueDate: t.dueDate, priority: t.priority })),
        suggestions,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get productivity stats history for charts
// @route   GET /api/productivity/history
// @access  Private
export const getProductivityHistory = async (req, res, next) => {
  try {
    const logs = await Productivity.find({ user: req.user._id }).sort({ date: 1 }).limit(30);
    res.json({ success: true, history: logs });
  } catch (error) {
    next(error);
  }
};

// @desc    Trigger interactive Coach review report
// @route   POST /api/productivity/coach-report
// @access  Private
export const triggerCoachReport = async (req, res, next) => {
  try {
    const coachResponseText = await productivityCoachAgent.run(
      req.body.message || 'Requesting a productivity audit and score review.',
      { user: req.user }
    );

    res.json({
      success: true,
      report: coachResponseText,
      updatedScore: req.user.productivityScore
    });
  } catch (error) {
    next(error);
  }
};
