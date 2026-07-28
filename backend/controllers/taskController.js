import asyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { taskService } from '../services/taskService.js';

/**
 * @desc    Create a new task item
 * @route   POST /api/tasks/create
 * @access  Private
 */
export const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTaskItem(req.body);
  return ApiResponse.created(res, task, 'Task successfully added to operational queue');
});

/**
 * @desc    Batch create tasks assigned from Planner Agent
 * @route   POST /api/tasks/batch-create
 * @access  Private
 */
export const batchCreateTasks = asyncHandler(async (req, res) => {
  const tasks = Array.isArray(req.body.tasks) ? req.body.tasks : [req.body];
  const createdTasks = [];
  for (const t of tasks) {
    if (t.title) {
      const saved = await taskService.createTaskItem({
        title: t.title,
        description: t.description || t.title,
        category: t.category || 'Study Daily',
        priority: (t.priority || 'high').toLowerCase(),
        status: 'pending',
        estimatedTime: t.estimatedMinutes || t.estimatedTime || 45,
        xpReward: t.xpReward || 30,
        dueDate: new Date().toISOString()
      });
      createdTasks.push(saved);
    }
  }
  return ApiResponse.created(res, createdTasks, 'Plan tasks successfully assigned to Task Queue');
});

/**
 * @desc    Fetch all tasks
 * @route   GET /api/tasks/all
 * @access  Private
 */
export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getAllTasks();
  return ApiResponse.success(res, tasks, 'Task queue list fetched successfully');
});

/**
 * @desc    Fetch tasks scheduled for today
 * @route   GET /api/tasks/today
 * @access  Private
 */
export const getTodayTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getAllTasks();
  return ApiResponse.success(res, tasks, 'Today\'s task queue fetched successfully');
});

/**
 * @desc    Update a task status/priority
 * @route   PUT /api/tasks/update or PUT /api/tasks/update/:id
 * @access  Private
 */
export const updateTask = asyncHandler(async (req, res) => {
  const id = req.params.id || req.body.id;
  const updated = await taskService.updateTaskItem(id, req.body);
  return ApiResponse.success(res, updated, 'Task updated successfully');
});

/**
 * @desc    Delete a task item
 * @route   DELETE /api/tasks/delete or DELETE /api/tasks/delete/:id
 * @access  Private
 */
export const deleteTask = asyncHandler(async (req, res) => {
  const id = req.params.id || req.body.id;
  await taskService.deleteTaskItem(id);
  return ApiResponse.success(res, { id }, 'Task deleted successfully');
});

/**
 * @desc    Complete task & award XP
 * @route   POST /api/tasks/complete or POST /api/tasks/complete/:id
 * @access  Private
 */
export const completeTask = asyncHandler(async (req, res) => {
  const id = req.params.id || req.body.id;
  const result = await taskService.completeTaskItem(id);
  return ApiResponse.success(res, result, 'Task completed & XP processed');
});

/**
 * @desc    Get productivity & category analytics
 * @route   GET /api/tasks/analytics
 * @access  Private
 */
export const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await taskService.getAnalyticsReport(req.user?._id);
  return ApiResponse.success(res, analytics, 'Analytics dashboard metrics fetched');
});

/**
 * @desc    Get user unlocked and pending achievements
 * @route   GET /api/tasks/achievements
 * @access  Private
 */
export const getAchievements = asyncHandler(async (req, res) => {
  const achievements = await taskService.getAchievementsList(req.user?._id);
  return ApiResponse.success(res, achievements, 'Achievements unlocked states fetched');
});

/**
 * @desc    Get user XP metrics and level targets
 * @route   GET /api/tasks/xp
 * @access  Private
 */
export const getXP = asyncHandler(async (req, res) => {
  const xp = await taskService.getXPMetrics(req.user?._id);
  return ApiResponse.success(res, xp, 'Experience points log fetched');
});

export default {
  createTask,
  batchCreateTasks,
  getTasks,
  getTodayTasks,
  updateTask,
  deleteTask,
  completeTask,
  getAnalytics,
  getAchievements,
  getXP
};
