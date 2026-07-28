import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    unlocked: {
      type: Boolean,
      default: false
    },
    unlockedAt: {
      type: Date,
      default: null
    },
    xpReward: {
      type: Number,
      default: 50
    },
    icon: {
      type: String,
      default: 'Award'
    }
  },
  {
    timestamps: true
  }
);

export const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
