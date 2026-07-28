import mongoose from 'mongoose';

const learningAnalyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    radarScores: [
      {
        domain: String,
        score: Number,
        target: Number
      }
    ],
    growthTimeline: [
      {
        week: String,
        score: Number,
        topicMastered: Number,
        quizAvg: String
      }
    ],
    learningHours: {
      type: Number,
      default: 120
    },
    quizAccuracy: {
      type: String,
      default: '85%'
    },
    codingAccuracy: {
      type: String,
      default: '80%'
    }
  },
  {
    timestamps: true
  }
);

export const LearningAnalytics = mongoose.model('LearningAnalytics', learningAnalyticsSchema);
export default LearningAnalytics;
