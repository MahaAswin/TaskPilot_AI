import mongoose from 'mongoose';

const creativeTemplateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Template title is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['image', 'flowchart', 'mindmap', 'diagram', 'infographic'],
      required: [true, 'Template type is required']
    },
    category: {
      type: String,
      default: 'General'
    },
    thumbnail: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const CreativeTemplate = mongoose.model('CreativeTemplate', creativeTemplateSchema);
export default CreativeTemplate;
