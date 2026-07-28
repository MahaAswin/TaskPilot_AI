import mongoose from 'mongoose';

const dailyReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    date: {
      type: Date,
      default: Date.now
    },
    tasksCompleted: {
      type: Number,
      default: 6
    },
    studyTime: {
      type: String,
      default: '4h 15m'
    },
    focusTime: {
      type: String,
      default: '3h 45m'
    },
    xpEarned: {
      type: Number,
      default: 180
    },
    highlights: [String],
    areasForImprovement: String
  },
  {
    timestamps: true
  }
);

export const DailyReport = mongoose.model('DailyReport', dailyReportSchema);
export default DailyReport;
