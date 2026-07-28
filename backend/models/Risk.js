import mongoose from 'mongoose';

const riskSchema = new mongoose.Schema(
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
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    category: {
      type: String,
      enum: ['Weak Topics', 'Pending Tasks', 'Time Constraints', 'Upcoming Deadlines'],
      default: 'Weak Topics'
    },
    mitigation: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const Risk = mongoose.model('Risk', riskSchema);
export default Risk;
