import mongoose from 'mongoose';

const creativeCollectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'UserId reference is required']
    },
    name: {
      type: String,
      required: [true, 'Collection name is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const CreativeCollection = mongoose.model('CreativeCollection', creativeCollectionSchema);
export default CreativeCollection;
