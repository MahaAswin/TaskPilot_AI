import mongoose from 'mongoose';

const habitAnalyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    dailyConsistency: {
      type: String,
      default: '92%'
    },
    habitStreak: {
      type: Number,
      default: 14
    },
    missedDays: {
      type: Number,
      default: 2
    },
    completionPercentage: {
      type: Number,
      default: 88
    }
  },
  {
    timestamps: true
  }
);

export const HabitAnalytics = mongoose.model('HabitAnalytics', habitAnalyticsSchema);
export default HabitAnalytics;
