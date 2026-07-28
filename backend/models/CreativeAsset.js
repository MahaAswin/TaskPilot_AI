import mongoose from 'mongoose';

const creativeAssetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'UserId reference is required']
    },
    title: {
      type: String,
      required: [true, 'Asset title description is required'],
      trim: true
    },
    prompt: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      enum: ['image', 'flowchart', 'mindmap', 'diagram', 'infographic'],
      required: [true, 'Asset type is required']
    },
    category: {
      type: String,
      default: 'General'
    },
    tags: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['generating', 'completed', 'failed'],
      default: 'completed'
    },
    thumbnail: {
      type: String,
      default: ''
    },
    fileUrl: {
      type: String,
      default: ''
    },
    isFavorite: {
      type: Boolean,
      default: false
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CreativeCollection'
    }
  },
  {
    timestamps: true
  }
);

export const CreativeAsset = mongoose.model('CreativeAsset', creativeAssetSchema);
export default CreativeAsset;
