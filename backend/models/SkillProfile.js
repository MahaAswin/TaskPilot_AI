import mongoose from 'mongoose';

const skillProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    overallScore: {
      type: Number,
      default: 78
    },
    currentRank: {
      type: String,
      enum: ['Beginner', 'Learner', 'Intermediate', 'Advanced', 'Expert', 'Master', 'Elite', 'Legend'],
      default: 'Master'
    },
    strongestSkill: {
      type: String,
      default: 'React Frontend Development'
    },
    weakestSkill: {
      type: String,
      default: 'Machine Learning'
    },
    learningStreak: {
      type: Number,
      default: 14
    }
  },
  {
    timestamps: true
  }
);

export const SkillProfile = mongoose.model('SkillProfile', skillProfileSchema);
export default SkillProfile;
