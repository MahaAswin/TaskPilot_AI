import mongoose from 'mongoose';

const conversationMemorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    conversationId: String,
    messages: [
      {
        role: {
          type: String,
          enum: ['system', 'user', 'assistant'],
          required: true
        },
        content: String,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const ConversationMemory = mongoose.model('ConversationMemory', conversationMemorySchema);
export default ConversationMemory;
