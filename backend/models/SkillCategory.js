import mongoose from 'mongoose';

const skillCategorySchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SkillProfile',
      required: false
    },
    title: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      default: 70
    },
    level: {
      type: String,
      default: 'Intermediate'
    },
    categoryGroup: {
      type: String,
      default: 'Core CS'
    },
    topicsCount: {
      type: Number,
      default: 10
    },
    masteredCount: {
      type: Number,
      default: 5
    },
    progress: {
      type: Number,
      default: 50
    }
  },
  {
    timestamps: true
  }
);

export const SkillCategory = mongoose.model('SkillCategory', skillCategorySchema);
export default SkillCategory;
