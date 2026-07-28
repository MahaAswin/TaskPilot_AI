import mongoose from 'mongoose';

const aiResponseSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AIRequest',
      required: false
    },
    provider: String,
    agent: String,
    tokens: Number,
    latency: String,
    response: String,
    citations: [String],
    confidence: Number
  },
  {
    timestamps: true
  }
);

export const AIResponse = mongoose.model('AIResponse', aiResponseSchema);
export default AIResponse;
