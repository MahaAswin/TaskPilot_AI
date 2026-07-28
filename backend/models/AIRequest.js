import mongoose from 'mongoose';

const aiRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    agent: String,
    provider: String,
    prompt: String,
    taskType: String
  },
  {
    timestamps: true
  }
);

export const AIRequest = mongoose.model('AIRequest', aiRequestSchema);
export default AIRequest;
