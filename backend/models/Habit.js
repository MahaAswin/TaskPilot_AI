import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'custom'],
      default: 'daily'
    },
    streak: {
      type: Number,
      default: 0
    },
    history: [
      {
        date: { type: Date, default: Date.now },
        status: { type: String, enum: ['completed', 'missed'], default: 'completed' }
      }
    ],
    xpReward: {
      type: Number,
      default: 15
    }
  },
  {
    timestamps: true
  }
);

export const Habit = mongoose.model('Habit', habitSchema);
export default Habit;
