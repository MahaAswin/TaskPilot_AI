import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    canvasId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlanningCanvas',
      required: false
    },
    category: {
      type: String,
      enum: ['Videos', 'Books', 'Articles', 'Practice Problems', 'Projects'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'Link'
    },
    link: {
      type: String,
      default: '#'
    },
    rating: {
      type: String,
      default: '5.0 ★'
    },
    badge: {
      type: String,
      default: 'Recommended'
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
