import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'New Conversation'
    }
  },
  {
    timestamps: true,
  }
);

export const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
