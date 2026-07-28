import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // Default 1 day from now
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    completedAt: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

// Auto-populate completedAt when state shifts to completed
taskSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'completed') {
      this.completedAt = new Date();
    } else {
      this.completedAt = undefined;
    }
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
