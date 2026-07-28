import mongoose from 'mongoose';

const knowledgeNoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Mongoose userId reference is required']
    },
    title: {
      type: String,
      required: [true, 'Note title is required'],
      trim: true
    },
    topic: {
      type: String,
      required: [true, 'Note topic is required'],
      trim: true
    },
    keywords: {
      type: [String],
      default: []
    },
    description: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      required: [true, 'Note content text body is required']
    },
    summary: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'General',
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    },
    language: {
      type: String,
      default: 'English'
    },
    status: {
      type: String,
      enum: ['draft', 'generated', 'saved', 'archived'],
      default: 'saved'
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    isFavorite: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const KnowledgeNote = mongoose.model('KnowledgeNote', knowledgeNoteSchema);
export default KnowledgeNote;
