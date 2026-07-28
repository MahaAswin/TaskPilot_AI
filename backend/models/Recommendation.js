import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
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
    category: {
      type: String,
      default: 'Focus'
    },
    impact: {
      type: String,
      default: 'High Impact'
    },
    reason: String,
    actionText: String,
    status: {
      type: String,
      enum: ['pending', 'applied', 'dismissed'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

export const Recommendation = mongoose.model('Recommendation', recommendationSchema);
export default Recommendation;
