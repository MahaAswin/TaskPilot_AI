import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema(
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
    tag: {
      type: String,
      default: 'Intensity'
    },
    description: {
      type: String,
      default: ''
    },
    actionText: {
      type: String,
      default: 'Apply'
    },
    applied: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const Suggestion = mongoose.model('Suggestion', suggestionSchema);
export default Suggestion;
