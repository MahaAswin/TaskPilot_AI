import mongoose from 'mongoose';

const generatedImageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true,
  }
);

export const GeneratedImage = mongoose.model('GeneratedImage', generatedImageSchema);
export default GeneratedImage;
