import asyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { skillService } from '../services/skillService.js';

export const getProfile = asyncHandler(async (req, res) => {
  const data = await skillService.getProfileData(req.user?._id);
  return ApiResponse.success(res, data, 'Skill Profile fetched successfully');
});

export const getCategories = asyncHandler(async (req, res) => {
  const data = await skillService.getCategoriesData(req.user?._id);
  return ApiResponse.success(res, data, 'Skill Categories list fetched');
});

export const getReports = asyncHandler(async (req, res) => {
  const data = await skillService.getReportsData(req.user?._id);
  return ApiResponse.success(res, data, 'Skill Performance Reports fetched');
});

export const getTimeline = asyncHandler(async (req, res) => {
  const data = await skillService.getTimelineData(req.user?._id);
  return ApiResponse.success(res, data, 'Skill Growth Timeline fetched');
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const data = await skillService.getRecommendationsData(req.user?._id);
  return ApiResponse.success(res, data, 'Skill Recommendations fetched');
});

export const updateProfile = asyncHandler(async (req, res) => {
  const data = await skillService.updateProfileData(req.user?._id, req.body);
  return ApiResponse.success(res, data, 'Skill Profile updated successfully');
});

export const analyzeSkills = asyncHandler(async (req, res) => {
  const data = await skillService.analyzeSkillsCycle(req.user?._id, req.body);
  return ApiResponse.success(res, data, 'Skill Analysis cycle completed (Placeholder)');
});

export default {
  getProfile,
  getCategories,
  getReports,
  getTimeline,
  getRecommendations,
  updateProfile,
  analyzeSkills
};
