import mongoose from 'mongoose';

const plannerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'UserId reference is required']
    },
    title: {
      type: String,
      required: [true, 'Plan title description is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      enum: ['daily', 'weekly', 'study', 'revision', 'general'],
      default: 'general'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    },
    estimatedDuration: {
      type: Number, // in minutes
      default: 30
    },
    plannedDate: {
      type: Date,
      required: [true, 'Planned target date is required']
    },
    completedDate: {
      type: Date
    },
    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal'
    }
  },
  {
    timestamps: true
  }
);

export const Planner = mongoose.model('Planner', plannerSchema);
export default Planner;
