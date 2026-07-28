import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    sender: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    agentTraces: [
      {
        agentName: String,
        status: String,
        message: String,
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model('Message', messageSchema);
export default Message;
