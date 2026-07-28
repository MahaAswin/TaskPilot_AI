import Task from '../models/Task.js';

// @desc    Get user tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ dueDate: 1 });
    res.json({ success: true, tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  const { title, description, dueDate, priority, category } = req.body;

  try {
    if (!title) {
      res.status(400);
      return next(new Error('Task title is required'));
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      dueDate,
      priority,
      category,
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status, priority, description, etc.
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      res.status(404);
      return next(new Error('Task not found'));
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description !== undefined ? req.body.description : task.description;
    task.status = req.body.status || task.status;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.category = req.body.category || task.category;

    const updatedTask = await task.save();

    res.json({ success: true, task: updatedTask });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      res.status(404);
      return next(new Error('Task not found'));
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get smart task recommendations
// @route   GET /api/tasks/recommendations
// @access  Private
export const getTaskRecommendations = async (req, res, next) => {
  try {
    const pendingTasks = await Task.find({ user: req.user._id, status: { $ne: 'completed' } });
    
    // Algorithmic recommendations: suggest tackling high-priority items overdue or due next
    const recommendations = [];
    const highPriority = pendingTasks.filter(t => t.priority === 'high');
    
    if (highPriority.length > 0) {
      recommendations.push({
        type: 'priority',
        message: `High Priority Focus: Tackle "${highPriority[0].title}" first to prevent schedule slip.`,
        taskId: highPriority[0]._id
      });
    }

    // Category recommendations
    const categoryCount = pendingTasks.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {});

    const topCategory = Object.keys(categoryCount).sort((a, b) => categoryCount[b] - categoryCount[a])[0];
    if (topCategory && categoryCount[topCategory] > 2) {
      recommendations.push({
        type: 'category',
        message: `De-clutter: You have ${categoryCount[topCategory]} pending items under "${topCategory}". Try grouping them.`,
      });
    }

    // General coach tip
    if (pendingTasks.length === 0) {
      recommendations.push({
        type: 'empty',
        message: 'No pending tasks! Excellent work. Use the Chat to ask the Planner Agent for study roadmaps or creative templates.'
      });
    } else {
      recommendations.push({
        type: 'general',
        message: 'Tip: Completing tasks before 4:00 PM matches your peak daily energy windows.'
      });
    }

    res.json({ success: true, recommendations });
  } catch (error) {
    next(error);
  }
};
