import mongoose from 'mongoose';

const executionLogSchema = new mongoose.Schema(
  {
    executionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Execution',
      required: false
    },
    agent: String,
    level: {
      type: String,
      enum: ['INFO', 'SUCCESS', 'WARNING', 'ERROR'],
      default: 'INFO'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const ExecutionLog = mongoose.model('ExecutionLog', executionLogSchema);
export default ExecutionLog;
