import mongoose from 'mongoose';

const weeklyPlanSchema = new mongoose.Schema(
  {
    canvasId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlanningCanvas',
      required: false
    },
    week: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    hoursEstimated: {
      type: Number,
      default: 20
    },
    progress: {
      type: Number,
      default: 0
    },
    objectives: [String],
    topics: [String],
    tasks: [
      {
        id: String,
        title: String,
        completed: Boolean
      }
    ]
  },
  {
    timestamps: true
  }
);

export const WeeklyPlan = mongoose.model('WeeklyPlan', weeklyPlanSchema);
export default WeeklyPlan;
