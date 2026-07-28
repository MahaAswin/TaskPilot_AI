import mongoose from 'mongoose';

const executionSchema = new mongoose.Schema(
  {
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workflow',
      required: false
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    goal: String,
    currentStep: {
      type: Number,
      default: 1
    },
    totalSteps: {
      type: Number,
      default: 5
    },
    status: {
      type: String,
      enum: ['running', 'completed', 'failed', 'cancelled'],
      default: 'running'
    },
    durationMs: {
      type: Number,
      default: 1200
    }
  },
  {
    timestamps: true
  }
);

export const Execution = mongoose.model('Execution', executionSchema);
export default Execution;
