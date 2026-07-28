import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
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
    category: {
      type: String,
      default: 'Career'
    },
    type: {
      type: String,
      default: 'study'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'high'
    },
    targetDate: {
      type: Date,
      default: Date.now
    },
    deadline: {
      type: String,
      default: ''
    },
    estimatedHours: {
      type: Number,
      default: 100
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate'
    },
    completion: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      default: 'pending'
    },
    attachments: [
      {
        name: String,
        url: String,
        size: String
      }
    ],
    voiceNote: {
      audioUrl: String,
      transcript: String
    }
  },
  {
    timestamps: true
  }
);

export const Goal = mongoose.model('Goal', goalSchema);
export default Goal;
