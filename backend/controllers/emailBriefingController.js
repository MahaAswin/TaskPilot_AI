import asyncHandler from '../utils/AsyncHandler.js';
import ApiError from '../utils/ApiError.js';
import emailBriefingService from '../services/emailBriefingService.js';

/**
 * @desc    Analyzes pasted text or uploaded email file to generate executive briefing JSON
 * @route   POST /api/email-briefing/analyze
 * @access  Public / Private
 */
export const analyzeBriefing = asyncHandler(async (req, res, next) => {
  const text = req.body.text || '';
  const file = req.file;

  if (!text.trim() && !file) {
    return next(ApiError.badRequest('Please paste an email text or upload a valid document (.txt, .pdf, .docx, .eml).'));
  }

  const userId = req.user?._id?.toString() || 'default-user';
  const result = await emailBriefingService.analyzeBriefing({ text, file, fileName: file?.originalname || '' }, userId);

  return res.status(200).json({
    success: true,
    message: 'Executive Briefing generated successfully.',
    data: result
  });
});

/**
 * @desc    Retrieves past briefing reports for current user
 * @route   GET /api/email-briefing/history
 * @access  Public / Private
 */
export const getHistory = asyncHandler(async (req, res) => {
  const userId = req.user?._id?.toString() || 'default-user';
  const limit = parseInt(req.query.limit, 10) || 20;

  const history = await emailBriefingService.getHistory(userId, limit);

  return res.status(200).json({
    success: true,
    count: history.length,
    data: history
  });
});

/**
 * @desc    Generates AI executive email reply draft based on briefing
 * @route   POST /api/email-briefing/reply
 * @access  Public / Private
 */
export const generateReply = asyncHandler(async (req, res, next) => {
  const { reportId, instruction } = req.body;

  if (!reportId) {
    return next(ApiError.badRequest('reportId is required to generate email reply draft.'));
  }

  const userId = req.user?._id?.toString() || 'default-user';
  const reply = await emailBriefingService.generateReplyDraft(reportId, instruction, userId);

  return res.status(200).json({
    success: true,
    data: reply
  });
});
