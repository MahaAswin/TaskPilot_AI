import asyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { orchestratorService } from '../services/orchestratorService.js';

export const runWorkflow = asyncHandler(async (req, res) => {
  const data = await orchestratorService.runPipeline(req.body.goal);
  return ApiResponse.success(res, data, 'Multi-Agent pipeline executed successfully');
});

export const getWorkflows = asyncHandler(async (req, res) => {
  const data = await orchestratorService.getWorkflowsData();
  return ApiResponse.success(res, data, 'Workflows list fetched');
});

export const getHistory = asyncHandler(async (req, res) => {
  const data = await orchestratorService.getHistoryData();
  return ApiResponse.success(res, data, 'Workflow execution history fetched');
});

export const getContext = asyncHandler(async (req, res) => {
  const data = await orchestratorService.getContextData();
  return ApiResponse.success(res, data, 'Shared Context Memory fetched');
});

export const getLogs = asyncHandler(async (req, res) => {
  const data = await orchestratorService.getLogsData();
  return ApiResponse.success(res, data, 'System Execution Logs fetched');
});

export const replayWorkflow = asyncHandler(async (req, res) => {
  const data = await orchestratorService.replayWorkflowCycle(req.body.workflowId);
  return ApiResponse.success(res, data, 'Workflow replayed successfully');
});

export default {
  runWorkflow,
  getWorkflows,
  getHistory,
  getContext,
  getLogs,
  replayWorkflow
};
