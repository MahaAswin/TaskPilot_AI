import mongoose from 'mongoose';

const focusSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    title: {
      type: String,
      default: 'Deep Work Focus Session'
    },
    durationMinutes: {
      type: Number,
      default: 25
    },
    breakMinutes: {
      type: Number,
      default: 5
    },
    distractionCount: {
      type: Number,
      default: 0
    },
    qualityScore: {
      type: String,
      default: 'Optimal'
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'completed'
    }
  },
  {
    timestamps: true
  }
);

export const FocusSession = mongoose.model('FocusSession', focusSessionSchema);
export default FocusSession;
