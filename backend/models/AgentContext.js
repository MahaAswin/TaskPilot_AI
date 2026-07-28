import mongoose from 'mongoose';

const agentContextSchema = new mongoose.Schema(
  {
    executionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Execution',
      required: false
    },
    activeIntent: String,
    goal: String,
    workflowType: String,
    selectedAgents: [String],
    sharedMemory: mongoose.Schema.Types.Mixed,
    executionState: String
  },
  {
    timestamps: true
  }
);

export const AgentContext = mongoose.model('AgentContext', agentContextSchema);
export default AgentContext;
