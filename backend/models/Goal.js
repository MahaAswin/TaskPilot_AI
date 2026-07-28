import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'UserId reference is required']
    },
    title: {
      type: String,
      required: [true, 'Goal title description is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      enum: ['short-term', 'long-term', 'career', 'study', 'project'],
      default: 'study'
    },
    targetDate: {
      type: Date,
      required: [true, 'Goal target date is required']
    },
    status: {
      type: String,
      enum: ['pending', 'achieved'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

export const Goal = mongoose.model('Goal', goalSchema);
export default Goal;
