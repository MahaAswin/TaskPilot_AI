import mongoose from 'mongoose';

const xpHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    action: {
      type: String,
      required: true // e.g. 'Task Completed', 'Habit Completed', 'Missed Task'
    },
    amount: {
      type: Number,
      required: true // e.g. +25, -10
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const XPHistory = mongoose.model('XPHistory', xpHistorySchema);
export default XPHistory;
