// Task Repository Layer Scaffolding (Safe DB Interface)

import { Task } from '../models/Task.js';
import { Habit } from '../models/Habit.js';
import { Achievement } from '../models/Achievement.js';
import { XPHistory } from '../models/XPHistory.js';
import { Level } from '../models/Level.js';
import { TaskAnalytics } from '../models/TaskAnalytics.js';

export const taskRepository = {
  create: async (taskData) => {
    try {
      const task = new Task(taskData);
      return await task.save();
    } catch (error) {
      console.warn('[TaskRepository] Database write failed. Falling back to local scaffolding object.');
      return { _id: `task_${Date.now()}`, ...taskData, createdAt: new Date() };
    }
  },

  findAll: async (query = {}) => {
    try {
      return await Task.find(query).sort({ createdAt: -1 });
    } catch (error) {
      return [];
    }
  },

  findById: async (id) => {
    try {
      return await Task.findById(id);
    } catch (error) {
      return null;
    }
  },

  update: async (id, updateData) => {
    try {
      return await Task.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      return { _id: id, ...updateData };
    }
  },

  delete: async (id) => {
    try {
      return await Task.findByIdAndDelete(id);
    } catch (error) {
      return { _id: id };
    }
  },

  getAnalytics: async (userId) => {
    try {
      const analytics = await TaskAnalytics.findOne({ userId });
      return analytics || null;
    } catch (error) {
      return null;
    }
  }
};

export default taskRepository;
