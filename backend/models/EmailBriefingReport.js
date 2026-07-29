import mongoose from 'mongoose';

const emailBriefingReportSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: 'default-user',
      index: true
    },
    rawText: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      default: ''
    },
    summary: {
      type: String,
      required: true
    },
    purpose: {
      type: String,
      default: 'Not Mentioned'
    },
    sender: {
      name: { type: String, default: 'Not Mentioned' },
      email: { type: String, default: 'Not Mentioned' },
      organization: { type: String, default: 'Not Mentioned' }
    },
    recipient: {
      name: { type: String, default: 'Not Mentioned' },
      email: { type: String, default: 'Not Mentioned' }
    },
    subject: {
      type: String,
      default: 'No Subject'
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low', '🔴 High', '🟡 Medium', '🟢 Low'],
      default: 'Medium'
    },
    deadlines: [{ type: String }],
    importantDates: [{ type: String }],
    tasks: [{ type: String }],
    questions: [{ type: String }],
    links: [{ type: String }],
    attachmentsMentioned: [{ type: String }],
    calendarEvents: [{
      title: String,
      date: String,
      time: String,
      reminder: String
    }],
    category: {
      type: String,
      default: 'Work'
    },
    riskLevel: {
      type: String,
      enum: ['Safe', 'Warning', 'Suspicious'],
      default: 'Safe'
    },
    readingTime: {
      type: String,
      default: '30 sec'
    },
    replyRequired: {
      required: { type: Boolean, default: false },
      reason: { type: String, default: 'No direct response explicitly requested.' }
    },
    recommendations: [{ type: String }],
    keyHighlights: [{ type: String }],
    grammarAnalysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    correctedText: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const EmailBriefingReport = mongoose.model('EmailBriefingReport', emailBriefingReportSchema);
export default EmailBriefingReport;
