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
    images: [
      {
        url: String,
        prompt: String,
      }
    ],
    agentTraces: [
      {
        agentName: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ['thinking', 'working', 'completed', 'failed', 'generating'],
          default: 'thinking',
        },
        message: {
          type: String,
          default: '',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
