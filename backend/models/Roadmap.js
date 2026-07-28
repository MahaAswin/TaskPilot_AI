import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'UserId reference is required']
    },
    title: {
      type: String,
      required: [true, 'Roadmap title description is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['learning', 'career', 'skill', 'project'],
      default: 'learning'
    },
    steps: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export const Roadmap = mongoose.model('Roadmap', roadmapSchema);
export default Roadmap;
