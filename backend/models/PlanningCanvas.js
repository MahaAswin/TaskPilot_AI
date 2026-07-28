import mongoose from 'mongoose';

const planningCanvasSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    templateId: {
      type: String,
      default: 'placement_prep'
    },
    goalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
      required: false
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    canvasNodes: [
      {
        id: String,
        type: { type: String, enum: ['milestone', 'branch'], default: 'milestone' },
        title: String,
        week: String,
        status: { type: String, default: 'pending' },
        progress: { type: Number, default: 0 },
        x: Number,
        y: Number,
        branches: [String],
        description: String
      }
    ],
    viewport: {
      zoomLevel: { type: Number, default: 1 },
      showGrid: { type: Boolean, default: true },
      activeView: { type: String, default: 'all' }
    },
    isDraft: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const PlanningCanvas = mongoose.model('PlanningCanvas', planningCanvasSchema);
export default PlanningCanvas;
