// AI Repository Layer

import { ProviderConfig } from '../models/ProviderConfig.js';
import { AIRequest } from '../models/AIRequest.js';

export const aiRepository = {
  getProviderConfigs: async () => {
    try {
      return await ProviderConfig.find().sort({ priority: 1 });
    } catch {
      return [];
    }
  },

  logRequest: async (requestData) => {
    try {
      return await AIRequest.create(requestData);
    } catch {
      return requestData;
    }
  }
};

export default aiRepository;
