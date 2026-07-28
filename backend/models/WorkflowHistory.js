import mongoose from 'mongoose';

const workflowHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    goal: String,
    agentsUsed: [String],
    duration: String,
    status: String,
    resultSummary: String
  },
  {
    timestamps: true
  }
);

export const WorkflowHistory = mongoose.model('WorkflowHistory', workflowHistorySchema);
export default WorkflowHistory;
