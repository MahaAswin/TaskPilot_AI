import asyncHandler from '../../../utils/AsyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import coordinatorService from '../service/CoordinatorService.js';

/**
 * @desc    POST chat prompt to Coordinator
 * @route   POST /api/coordinator/chat
 * @access  Private
 */
export const postCoordinatorChat = asyncHandler(async (req, res, next) => {
  const { prompt, sessionId, workspace } = req.body;

  if (!prompt) {
    return next(ApiError.badRequest('Prompt query parameter is required'));
  }

  const result = await coordinatorService.executePipeline(prompt, {
    sessionId: sessionId || `session-chat-${Date.now()}`,
    workspace: workspace || { title: 'General Sandbox' }
  });

  return ApiResponse.success(res, result, 'Coordinator query processed successfully');
});

/**
 * @desc    POST execute pipelines triggers
 * @route   POST /api/coordinator/execute
 * @access  Private
 */
export const postCoordinatorExecute = asyncHandler(async (req, res, next) => {
  const { prompt, sessionId, workspace, history, preferences } = req.body;

  if (!prompt) {
    return next(ApiError.badRequest('Prompt query parameter is required'));
  }

  const result = await coordinatorService.executePipeline(prompt, {
    sessionId: sessionId || `session-exec-${Date.now()}`,
    workspace: workspace || { title: 'General Sandbox' },
    history: history || [],
    preferences: preferences || { theme: 'light' }
  });

  return ApiResponse.success(res, result, 'Execution pipeline completed');
});

/**
 * @desc    GET status of session execution
 * @route   GET /api/coordinator/status
 * @access  Private
 */
export const getCoordinatorStatus = asyncHandler(async (req, res, next) => {
  const { sessionId } = req.query;

  if (!sessionId) {
    return next(ApiError.badRequest('sessionId query parameter is required'));
  }

  const session = coordinatorService.getSession(sessionId);
  if (!session) {
    return next(ApiError.notFound(`Session ${sessionId} not found`));
  }

  return ApiResponse.success(res, {
    sessionId: session.sessionId,
    status: session.status,
    currentAgent: session.currentAgent,
    traces: session.traces
  }, 'Session status retrieved');
});

/**
 * @desc    GET full session logs
 * @route   GET /api/coordinator/session
 * @access  Private
 */
export const getCoordinatorSession = asyncHandler(async (req, res, next) => {
  const { sessionId } = req.query;

  if (!sessionId) {
    return next(ApiError.badRequest('sessionId query parameter is required'));
  }

  const session = coordinatorService.getSession(sessionId);
  if (!session) {
    return next(ApiError.notFound(`Session ${sessionId} not found`));
  }

  return ApiResponse.success(res, session, 'Session logs retrieved');
});
export default { postCoordinatorChat, postCoordinatorExecute, getCoordinatorStatus, getCoordinatorSession };
