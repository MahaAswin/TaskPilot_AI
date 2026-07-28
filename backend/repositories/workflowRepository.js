// Workflow Repository Layer

import { Workflow } from '../models/Workflow.js';
import { ExecutionLog } from '../models/ExecutionLog.js';

export const workflowRepository = {
  getAllWorkflows: async () => {
    try {
      return await Workflow.find().sort({ createdAt: -1 });
    } catch {
      return [];
    }
  },

  saveExecutionLog: async (logData) => {
    try {
      return await ExecutionLog.create(logData);
    } catch {
      return logData;
    }
  }
};

export default workflowRepository;
