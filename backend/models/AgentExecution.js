import mongoose from 'mongoose';

const agentExecutionSchema = new mongoose.Schema(
  {
    executionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Execution',
      required: false
    },
    agentName: {
      type: String,
      required: true
    },
    action: String,
    inputPayload: mongoose.Schema.Types.Mixed,
    outputPayload: mongoose.Schema.Types.Mixed,
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'error'],
      default: 'completed'
    },
    durationMs: Number
  },
  {
    timestamps: true
  }
);

export const AgentExecution = mongoose.model('AgentExecution', agentExecutionSchema);
export default AgentExecution;
