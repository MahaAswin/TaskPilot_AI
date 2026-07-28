import mongoose from 'mongoose';

const learningSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'UserId reference is required']
    },
    topic: {
      type: String,
      required: [true, 'Session topic is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'completed'],
      default: 'active'
    },
    progress: {
      type: Number,
      default: 0 // percentage 0 - 100
    },
    duration: {
      type: Number,
      default: 0 // study duration in minutes
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const LearningSession = mongoose.model('LearningSession', learningSessionSchema);
export default LearningSession;
