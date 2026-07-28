import mongoose from 'mongoose';

const productivityProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    productivityScore: {
      type: Number,
      default: 88
    },
    focusHours: {
      type: Number,
      default: 28.5
    },
    studyHours: {
      type: Number,
      default: 18.2
    },
    taskCompletionRate: {
      type: Number,
      default: 85
    },
    consistencyScore: {
      type: Number,
      default: 92
    },
    currentStreak: {
      type: Number,
      default: 14
    }
  },
  {
    timestamps: true
  }
);

export const ProductivityProfile = mongoose.model('ProductivityProfile', productivityProfileSchema);
export default ProductivityProfile;
