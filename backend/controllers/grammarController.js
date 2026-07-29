import asyncHandler from '../utils/AsyncHandler.js';
import ApiError from '../utils/ApiError.js';
import GrammarService from '../services/grammar/GrammarService.js';

/**
 * @desc    Analyzes grammar and writing quality using LanguageTool API
 * @route   POST /api/grammar/check
 * @access  Public / Private
 */
export const checkGrammar = asyncHandler(async (req, res, next) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return next(ApiError.badRequest('Please provide valid email text for grammar inspection.'));
  }

  const result = await GrammarService.analyze(text);

  return res.status(200).json({
    success: true,
    data: result
  });
});
