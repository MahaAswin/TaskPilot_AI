import mongoose from 'mongoose';

const learningQuizSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'UserId reference is required']
    },
    question: {
      type: String,
      required: [true, 'Quiz question text is required'],
      trim: true
    },
    options: {
      type: [String],
      required: [true, 'Quiz options array list is required']
    },
    correctIndex: {
      type: Number,
      required: [true, 'Correct option index reference is required']
    }
  },
  {
    timestamps: true
  }
);

export const LearningQuiz = mongoose.model('LearningQuiz', learningQuizSchema);
export default LearningQuiz;
