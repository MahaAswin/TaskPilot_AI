import mongoose from 'mongoose';

const levelSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    level: {
      type: Number,
      default: 1
    },
    currentXP: {
      type: Number,
      default: 0
    },
    requiredXP: {
      type: Number,
      default: 100
    },
    title: {
      type: String,
      default: 'Beginner' // e.g. Learner, Explorer, Intermediate, Advanced, Expert, Master, Legend
    }
  },
  {
    timestamps: true
  }
);

export const Level = mongoose.model('Level', levelSchema);
export default Level;
