import mongoose from 'mongoose';

const providerConfigSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    apiKey: String,
    baseUrl: String,
    timeout: {
      type: Number,
      default: 10000
    },
    priority: {
      type: Number,
      default: 1
    },
    maxTokens: {
      type: Number,
      default: 2048
    },
    temperature: {
      type: Number,
      default: 0.7
    },
    model: String,
    isEnabled: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const ProviderConfig = mongoose.model('ProviderConfig', providerConfigSchema);
export default ProviderConfig;
