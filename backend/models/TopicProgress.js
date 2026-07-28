import mongoose from 'mongoose';

const topicProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    topic: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: 'General'
    },
    score: {
      type: Number,
      default: 70
    },
    progress: {
      type: Number,
      default: 70
    },
    confidence: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    practiceCount: {
      type: Number,
      default: 10
    },
    quizAccuracy: {
      type: String,
      default: '80%'
    },
    studyTime: {
      type: String,
      default: '5h 0m'
    },
    masteryLevel: {
      type: String,
      default: 'Intermediate'
    }
  },
  {
    timestamps: true
  }
);

export const TopicProgress = mongoose.model('TopicProgress', topicProgressSchema);
export default TopicProgress;
