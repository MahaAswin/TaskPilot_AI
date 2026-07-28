import asyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * @desc    Placeholder to request a schedule roadmap plan
 * @route   POST /api/planner/roadmap
 * @access  Private
 */
export const generateRoadmap = asyncHandler(async (req, res) => {
  const mockRoadmap = {
    title: req.body.title || 'Productivity Roadmap Plan',
    phases: [
      { name: 'Phase 1: Foundation Setup', duration: '3 days' },
      { name: 'Phase 2: Business Logic Implementation', duration: '5 days' }
    ],
    createdAt: new Date()
  };

  return ApiResponse.success(res, mockRoadmap, 'Scheduling roadmap plan generated successfully');
});
