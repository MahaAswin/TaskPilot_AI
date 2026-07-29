import asyncHandler from '../utils/AsyncHandler.js';
import ApiError from '../utils/ApiError.js';
import emailCoachService from '../services/emailCoachService.js';

/**
 * @desc    Analyzes submitted email content using LanguageTool API + AI Interpretation
 * @route   POST /api/email-coach/analyze
 * @access  Public / Private
 */
export const analyzeEmail = asyncHandler(async (req, res, next) => {
  const { text, subject } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return next(ApiError.badRequest('Please provide valid email text content to analyze.'));
  }

  const userId = req.user?._id?.toString() || 'default-user';
  const result = await emailCoachService.analyzeEmail({ text, subject }, userId);

  return res.status(200).json({
    success: true,
    message: 'Email analyzed successfully.',
    data: result
  });
});

/**
 * @desc    Fetches previous analyzed email reports for current user
 * @route   GET /api/email-coach/history
 * @access  Public / Private
 */
export const getHistory = asyncHandler(async (req, res) => {
  const userId = req.user?._id?.toString() || 'default-user';
  const limit = parseInt(req.query.limit, 10) || 20;

  const history = await emailCoachService.getHistory(userId, limit);

  return res.status(200).json({
    success: true,
    count: history.length,
    data: history
  });
});

/**
 * @desc    Fetches writing progress tracker statistics over time
 * @route   GET /api/email-coach/stats
 * @access  Public / Private
 */
export const getStats = asyncHandler(async (req, res) => {
  const userId = req.user?._id?.toString() || 'default-user';
  const stats = await emailCoachService.getStats(userId);

  return res.status(200).json({
    success: true,
    data: stats
  });
});

/**
 * @desc    Compares two analyzed emails side-by-side
 * @route   POST /api/email-coach/compare
 * @access  Public / Private
 */
export const compareReports = asyncHandler(async (req, res, next) => {
  const { currentId, previousId } = req.body;

  if (!currentId || !previousId) {
    return next(ApiError.badRequest('Both currentId and previousId are required for comparison.'));
  }

  const userId = req.user?._id?.toString() || 'default-user';
  const comparison = await emailCoachService.compareReports(currentId, previousId, userId);

  return res.status(200).json({
    success: true,
    data: comparison
  });
});
