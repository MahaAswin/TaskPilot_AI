import mongoose from 'mongoose';

const revisionPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'UserId reference is required']
    },
    topic: {
      type: String,
      required: [true, 'Revision topic is required'],
      trim: true
    },
    interval: {
      type: Number, // days between revisions
      default: 7
    },
    lastRevised: {
      type: Date
    },
    nextRevision: {
      type: Date
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  { timestamps: true }
);

export const RevisionPlan = mongoose.model('RevisionPlan', revisionPlanSchema);
export default RevisionPlan;
