import mongoose from 'mongoose';

const performanceReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    type: {
      type: String,
      enum: ['weekly', 'monthly', 'overall'],
      default: 'weekly'
    },
    title: {
      type: String,
      default: 'Performance Report'
    },
    summary: {
      type: String,
      default: ''
    },
    exportUrl: {
      type: String,
      default: '#'
    }
  },
  {
    timestamps: true
  }
);

export const PerformanceReport = mongoose.model('PerformanceReport', performanceReportSchema);
export default PerformanceReport;
