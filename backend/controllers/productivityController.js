import asyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { productivityService } from '../services/productivityService.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await productivityService.getDashboardData(req.user?._id);
  return ApiResponse.success(res, data, 'Productivity Dashboard fetched successfully');
});

export const getDailyReport = asyncHandler(async (req, res) => {
  const data = await productivityService.getDailyReportData(req.user?._id);
  return ApiResponse.success(res, data, 'Daily Productivity Report fetched');
});

export const getWeeklyReport = asyncHandler(async (req, res) => {
  const data = await productivityService.getWeeklyReportData(req.user?._id);
  return ApiResponse.success(res, data, 'Weekly Productivity Report fetched');
});

export const getMonthlyReport = asyncHandler(async (req, res) => {
  const data = await productivityService.getMonthlyReportData(req.user?._id);
  return ApiResponse.success(res, data, 'Monthly Productivity Report fetched');
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const data = await productivityService.getRecommendationsData(req.user?._id);
  return ApiResponse.success(res, data, 'Productivity Recommendations fetched');
});

export const getFocusSessions = asyncHandler(async (req, res) => {
  const data = await productivityService.getFocusSessionsData(req.user?._id);
  return ApiResponse.success(res, data, 'Focus Sessions history fetched');
});

export const startFocusSession = asyncHandler(async (req, res) => {
  const data = await productivityService.startFocusSessionCycle(req.user?._id, req.body);
  return ApiResponse.created(res, data, 'Focus Session started');
});

export const endFocusSession = asyncHandler(async (req, res) => {
  const data = await productivityService.endFocusSessionCycle(req.user?._id, req.body);
  return ApiResponse.success(res, data, 'Focus Session completed');
});

export const updateProfile = asyncHandler(async (req, res) => {
  const data = await productivityService.updateProfileData(req.user?._id, req.body);
  return ApiResponse.success(res, data, 'Productivity Profile updated successfully');
});

export default {
  getDashboard,
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  getRecommendations,
  getFocusSessions,
  startFocusSession,
  endFocusSession,
  updateProfile
};
