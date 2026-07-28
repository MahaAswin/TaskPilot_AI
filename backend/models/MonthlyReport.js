import mongoose from 'mongoose';

const monthlyReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    period: {
      type: String,
      default: 'Current Month'
    },
    monthlySummary: String,
    goalsCompleted: {
      type: Number,
      default: 8
    },
    hoursInvested: {
      type: Number,
      default: 112
    },
    achievementsUnlocked: {
      type: Number,
      default: 5
    }
  },
  {
    timestamps: true
  }
);

export const MonthlyReport = mongoose.model('MonthlyReport', monthlyReportSchema);
export default MonthlyReport;
