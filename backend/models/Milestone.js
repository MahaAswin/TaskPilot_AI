import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema(
  {
    canvasId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlanningCanvas',
      required: false
    },
    title: {
      type: String,
      required: true
    },
    targetDate: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Low'
    },
    deliverables: [String],
    dependencies: [String]
  },
  {
    timestamps: true
  }
);

export const Milestone = mongoose.model('Milestone', milestoneSchema);
export default Milestone;
