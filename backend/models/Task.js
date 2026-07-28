import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    category: {
      type: String,
      default: 'General'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    deadline: {
      type: Date,
      default: null
    },
    estimatedTime: {
      type: Number, // in minutes
      default: 0
    },
    completedTime: {
      type: Number, // in minutes
      default: 0
    },
    xpReward: {
      type: Number,
      default: 20
    },
    isRecurring: {
      type: Boolean,
      default: false
    },
    reminder: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const Task = mongoose.model('Task', taskSchema);
export default Task;
