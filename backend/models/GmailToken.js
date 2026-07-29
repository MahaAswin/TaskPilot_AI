import mongoose from 'mongoose';

const gmailTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    accessToken: {
      type: String,
      required: true
    },
    refreshToken: {
      type: String,
      default: ''
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const GmailToken = mongoose.model('GmailToken', gmailTokenSchema);
export default GmailToken;
