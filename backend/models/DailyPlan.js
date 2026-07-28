import mongoose from 'mongoose';

const dailyPlanSchema = new mongoose.Schema(
  {
    canvasId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlanningCanvas',
      required: false
    },
    slot: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'night'],
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    time: {
      type: String,
      default: ''
    },
    focus: {
      type: String,
      default: ''
    },
    tasks: [
      {
        id: String,
        title: String,
        duration: String,
        priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
        completed: { type: Boolean, default: false }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const DailyPlan = mongoose.model('DailyPlan', dailyPlanSchema);
export default DailyPlan;
