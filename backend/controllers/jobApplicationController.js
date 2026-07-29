import asyncHandler from '../utils/AsyncHandler.js';
import ApiError from '../utils/ApiError.js';
import JobApplicationService from '../services/jobApplication/JobApplicationService.js';
import ApplicationHistoryService from '../services/jobApplication/ApplicationHistoryService.js';

/**
 * @desc    Search live jobs via AI Career Intelligence Agent
 * @route   POST /api/job-application/search-jobs
 * @access  Public / Private
 */
export const searchJobs = asyncHandler(async (req, res) => {
  const result = await JobApplicationService.searchLiveJobs(req.body);
  return res.status(200).json({
    success: true,
    data: result
  });
});

/**
 * @desc    Prepare application email and cover letter documents
 * @route   POST /api/job-application/prepare
 * @access  Public / Private
 */
export const prepareApplication = asyncHandler(async (req, res) => {
  if (!req.body.fullName || !req.body.email) {
    throw ApiError.badRequest('Candidate full name and email are required.');
  }

  const result = await JobApplicationService.prepareApplication(req.body);
  return res.status(200).json({
    success: true,
    data: result
  });
});

/**
 * @desc    Submit application email to HR & save in application history
 * @route   POST /api/job-application/submit
 * @access  Public / Private
 */
export const submitApplication = asyncHandler(async (req, res) => {
  const result = await JobApplicationService.submitApplication(req.body);
  return res.status(200).json({
    success: true,
    message: result.message,
    data: result.historyRecord
  });
});

/**
 * @desc    Get application submission history
 * @route   GET /api/job-application/history
 * @access  Public / Private
 */
export const getHistory = asyncHandler(async (req, res) => {
  const history = ApplicationHistoryService.getHistory(req.query);
  return res.status(200).json({
    success: true,
    data: history
  });
});
