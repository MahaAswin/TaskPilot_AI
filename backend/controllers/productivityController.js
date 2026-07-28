import asyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * @desc    Placeholder to retrieve productivity history summary
 * @route   GET /api/productivity/history
 * @access  Private
 */
export const getChartHistory = asyncHandler(async (req, res) => {
  const mockHistory = [
    { date: 'Mon', score: 65, completed: 3 },
    { date: 'Tue', score: 72, completed: 4 },
    { date: 'Wed', score: 70, completed: 3 },
    { date: 'Thu', score: 85, completed: 6 },
    { date: 'Fri', score: 90, completed: 7 }
  ];

  return ApiResponse.success(res, mockHistory, 'Operational statistics logs fetched successfully');
});

/**
 * @desc    Placeholder to run coach analysis reports
 * @route   POST /api/productivity/coach
 * @access  Private
 */
export const getCoachReport = asyncHandler(async (req, res) => {
  const mockReport = {
    weeklyScore: 78,
    evaluation: 'Excellent focus metrics. Try scheduling tasks earlier in mornings.',
    coachingTips: [
      'Time block study sessions',
      'Mark items completed immediately'
    ]
  };

  return ApiResponse.success(res, mockReport, 'Motivational audit generated');
});
