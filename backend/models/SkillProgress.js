import mongoose from 'mongoose';

const skillProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SkillCategory',
      required: false
    },
    previousScore: {
      type: Number,
      default: 0
    },
    currentScore: {
      type: Number,
      default: 0
    },
    weeklyGrowth: {
      type: String,
      default: '+5%'
    }
  },
  {
    timestamps: true
  }
);

export const SkillProgress = mongoose.model('SkillProgress', skillProgressSchema);
export default SkillProgress;
