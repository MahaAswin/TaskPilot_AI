import mongoose from 'mongoose';

const learningBookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'UserId reference is required']
    },
    contentType: {
      type: String,
      enum: ['note', 'flashcard', 'question', 'topic'],
      required: [true, 'Bookmark contentType is required']
    },
    title: {
      type: String,
      required: [true, 'Bookmark title description is required'],
      trim: true
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Bookmark reference ID reference is required']
    }
  },
  {
    timestamps: true
  }
);

export const LearningBookmark = mongoose.model('LearningBookmark', learningBookmarkSchema);
export default LearningBookmark;
