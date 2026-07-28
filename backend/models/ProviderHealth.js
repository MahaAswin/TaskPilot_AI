import mongoose from 'mongoose';

const providerHealthSchema = new mongoose.Schema(
  {
    providerName: String,
    status: {
      type: String,
      enum: ['online', 'degraded', 'offline'],
      default: 'online'
    },
    latencyMs: Number,
    errorRate: String
  },
  {
    timestamps: true
  }
);

export const ProviderHealth = mongoose.model('ProviderHealth', providerHealthSchema);
export default ProviderHealth;
