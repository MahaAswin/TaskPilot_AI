import mongoose from 'mongoose';

const promptTemplateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    agent: String,
    systemPrompt: String,
    templateBody: String
  },
  {
    timestamps: true
  }
);

export const PromptTemplate = mongoose.model('PromptTemplate', promptTemplateSchema);
export default PromptTemplate;
