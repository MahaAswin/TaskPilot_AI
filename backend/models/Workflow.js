import mongoose from 'mongoose';

const workflowSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    intent: {
      type: String,
      default: 'General'
    },
    workflowType: {
      type: String,
      enum: ['Single Agent', 'Multi Agent', 'Sequential', 'Parallel', 'Conditional', 'Fallback'],
      default: 'Sequential'
    },
    agents: [String],
    nodes: [
      {
        id: String,
        agentId: String,
        label: String,
        status: String,
        step: Number
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'failed'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

export const Workflow = mongoose.model('Workflow', workflowSchema);
export default Workflow;
