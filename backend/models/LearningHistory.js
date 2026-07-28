import mongoose from 'mongoose';

const learningHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'UserId reference is required']
    },
    activityType: {
      type: String,
      enum: ['read', 'quiz', 'flashcards', 'challenge'],
      required: [true, 'History activityType reference is required']
    },
    topic: {
      type: String,
      required: [true, 'History topic detail is required'],
      trim: true
    },
    score: {
      type: Number,
      default: 0 // Optional quiz score or study progress percent
    }
  },
  {
    timestamps: true
  }
);

export const LearningHistory = mongoose.model('LearningHistory', learningHistorySchema);
export default LearningHistory;
