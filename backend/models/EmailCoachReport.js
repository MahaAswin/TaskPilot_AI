import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  type: { type: String, required: true },
  category: { type: String, default: 'General' },
  errorText: { type: String, required: true },
  explanation: { type: String, required: true },
  suggestion: { type: String, required: true },
  deduction: { type: Number, default: 0 },
});

const emailCoachReportSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: 'default-user',
      index: true
    },
    subject: {
      type: String,
      default: ''
    },
    originalText: {
      type: String,
      required: true
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    scoreCategory: {
      type: String,
      enum: ['Excellent', 'Good', 'Fair', 'Needs Improvement'],
      default: 'Good'
    },
    scoreBreakdown: {
      grammar: { type: Number, default: 40 },
      spelling: { type: Number, default: 15 },
      sentenceStructure: { type: Number, default: 15 },
      tone: { type: Number, default: 15 },
      readability: { type: Number, default: 10 },
      formatting: { type: Number, default: 5 }
    },
    writingLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional', 'Expert'],
      default: 'Professional'
    },
    levelConfidence: {
      type: Number,
      default: 90
    },
    levelAssessment: {
      type: String,
      default: ''
    },
    detectedTone: {
      type: String,
      enum: ['Professional', 'Formal', 'Friendly', 'Casual', 'Sales', 'Marketing', 'Customer Support', 'Academic', 'Business'],
      default: 'Professional'
    },
    toneConfidence: {
      type: Number,
      default: 90
    },
    issues: [issueSchema],
    metrics: {
      grammarErrorsCount: { type: Number, default: 0 },
      spellingErrorsCount: { type: Number, default: 0 },
      punctuationErrorsCount: { type: Number, default: 0 },
      totalIssuesCount: { type: Number, default: 0 },
      wordCount: { type: Number, default: 0 },
      readingTimeSeconds: { type: Number, default: 0 },
      readabilityScore: { type: Number, default: 85 },
      formattingScore: { type: Number, default: 100 },
      vocabularyQuality: { type: String, default: 'Strong' }
    },
    aiSuggestions: [{ type: String }],
    correctedText: {
      type: String,
      required: true
    },
    aiSummary: {
      type: String,
      default: ''
    },
    improvementFeedback: {
      type: String,
      default: ''
    },
    finalVerdict: {
      stars: { type: Number, default: 5, min: 1, max: 5 },
      verdictText: { type: String, default: 'Excellent Email' },
      readyToSend: { type: Boolean, default: true },
      statusBadge: { type: String, default: 'Ready to Send' }
    }
  },
  {
    timestamps: true
  }
);

export const EmailCoachReport = mongoose.model('EmailCoachReport', emailCoachReportSchema);
export default EmailCoachReport;
