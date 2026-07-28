import mongoose from 'mongoose';

const productivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      required: true,
      default: 70
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true
    },
    completedTasksCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

// Create compound unique index for user per day
productivitySchema.index({ user: 1, date: 1 }, { unique: true });

export const Productivity = mongoose.model('Productivity', productivitySchema);
export default Productivity;
