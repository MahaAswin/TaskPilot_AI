import mongoose from 'mongoose';

const productivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String, // format YYYY-MM-DD
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 70,
    },
    tasksCompletedCount: {
      type: Number,
      default: 0,
    },
    weeklySuggestions: [
      {
        type: String,
      }
    ]
  },
  {
    timestamps: true,
  }
);

// Unique compound key for user per date
productivitySchema.index({ user: 1, date: 1 }, { unique: true });

const Productivity = mongoose.model('Productivity', productivitySchema);
export default Productivity;
