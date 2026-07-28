import mongoose from 'mongoose';

const taskAnalyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    completionRate: {
      type: Number,
      default: 0
    },
    weeklyProductivity: [
      {
        week: String,
        score: Number
      }
    ],
    monthlyProductivity: [
      {
        month: String,
        score: Number
      }
    ],
    categoryBreakdown: [
      {
        category: String,
        count: Number
      }
    ],
    timeSpent: {
      type: Number, // in minutes
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const TaskAnalytics = mongoose.model('TaskAnalytics', taskAnalyticsSchema);
export default TaskAnalytics;
