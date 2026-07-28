import mongoose from 'mongoose';

const learningFlashcardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'UserId reference is required']
    },
    front: {
      type: String,
      required: [true, 'Flashcard front term text is required'],
      trim: true
    },
    back: {
      type: String,
      required: [true, 'Flashcard back definition text is required'],
      trim: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    isBookmarked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const LearningFlashcard = mongoose.model('LearningFlashcard', learningFlashcardSchema);
export default LearningFlashcard;
