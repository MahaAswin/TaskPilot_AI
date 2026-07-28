import mongoose from 'mongoose';

const weeklyReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    period: {
      type: String,
      default: 'Current Week'
    },
    weeklyProductivity: {
      type: Number,
      default: 88
    },
    weeklyLearning: {
      type: String,
      default: '24.5 hrs'
    },
    skillImprovement: {
      type: String,
      default: '+6.2%'
    },
    taskCompletion: {
      type: String,
      default: '85%'
    },
    habitConsistency: {
      type: String,
      default: '92%'
    }
  },
  {
    timestamps: true
  }
);

export const WeeklyReport = mongoose.model('WeeklyReport', weeklyReportSchema);
export default WeeklyReport;
