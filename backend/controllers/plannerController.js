import Planner from '../models/Planner.js';
import Goal from '../models/Goal.js';
import Roadmap from '../models/Roadmap.js';
import CalendarEvent from '../models/CalendarEvent.js';
import RevisionPlan from '../models/RevisionPlan.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/AsyncHandler.js';

// ─── PLANS ─────────────────────────────────────────────────────────────────

/**
 * @desc    Create a new plan item
 * @route   POST /api/planner/create
 * @access  Private
 */
export const createPlan = asyncHandler(async (req, res, next) => {
  const { title, description, category, priority, estimatedDuration, plannedDate, goalId } = req.body;

  const plan = await Planner.create({
    userId: req.user._id,
    title,
    description: description || '',
    category: category || 'general',
    priority: priority || 'medium',
    estimatedDuration: estimatedDuration || 30,
    plannedDate,
    goalId: goalId || undefined
  });

  return ApiResponse.created(res, plan, 'Plan created successfully');
});

/**
 * @desc    Get all plans for user
 * @route   GET /api/planner/all
 * @access  Private
 */
export const getAllPlans = asyncHandler(async (req, res, next) => {
  const { category, status } = req.query;
  const filter = { userId: req.user._id };
  if (category) filter.category = category;
  if (status) filter.status = status;

  const plans = await Planner.find(filter).sort({ plannedDate: 1 });
  return ApiResponse.success(res, plans, 'Plans retrieved successfully');
});

/**
 * @desc    Update a plan
 * @route   PUT /api/planner/update
 * @access  Private
 */
export const updatePlan = asyncHandler(async (req, res, next) => {
  const { id, ...updates } = req.body;

  if (!id) return next(ApiError.badRequest('Plan ID is required'));

  const plan = await Planner.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { ...updates },
    { new: true, runValidators: true }
  );

  if (!plan) return next(ApiError.notFound('Plan not found'));
  return ApiResponse.success(res, plan, 'Plan updated successfully');
});

/**
 * @desc    Delete a plan
 * @route   DELETE /api/planner/delete
 * @access  Private
 */
export const deletePlan = asyncHandler(async (req, res, next) => {
  const id = req.body.id || req.query.id;
  if (!id) return next(ApiError.badRequest('Plan ID is required'));

  const plan = await Planner.findOneAndDelete({ _id: id, userId: req.user._id });
  if (!plan) return next(ApiError.notFound('Plan not found'));

  return ApiResponse.success(res, { id }, 'Plan deleted successfully');
});

// ─── CALENDAR ──────────────────────────────────────────────────────────────

/**
 * @desc    Get calendar events
 * @route   GET /api/planner/calendar
 * @access  Private
 */
export const getCalendarEvents = asyncHandler(async (req, res, next) => {
  const events = await CalendarEvent.find({ userId: req.user._id }).sort({ start: 1 });

  // Seed placeholder events if empty
  const mockEvents = [
    { _id: 'ev-1', title: 'DSA Mock Test', start: new Date(), category: 'exam', color: '#EF4444' },
    { _id: 'ev-2', title: 'Spring Boot Lecture', start: new Date(Date.now() + 86400000), category: 'class', color: '#4F46E5' },
    { _id: 'ev-3', title: 'Project Deadline', start: new Date(Date.now() + 3 * 86400000), category: 'deadline', color: '#F59E0B' },
    { _id: 'ev-4', title: 'OS Concepts Revision', start: new Date(Date.now() + 5 * 86400000), category: 'revision', color: '#22C55E' },
    { _id: 'ev-5', title: 'ML Assignment Submit', start: new Date(Date.now() + 7 * 86400000), category: 'milestone', color: '#7C3AED' },
  ];

  const result = events.length > 0 ? events : mockEvents;
  return ApiResponse.success(res, result, 'Calendar events retrieved');
});

/**
 * @desc    Create a calendar event
 * @route   POST /api/planner/calendar
 * @access  Private
 */
export const createCalendarEvent = asyncHandler(async (req, res, next) => {
  const { title, start, end, category, color } = req.body;

  const event = await CalendarEvent.create({
    userId: req.user._id,
    title, start,
    end: end || undefined,
    category: category || 'study',
    color: color || '#4F46E5'
  });

  return ApiResponse.created(res, event, 'Calendar event created');
});

// ─── GOALS ─────────────────────────────────────────────────────────────────

/**
 * @desc    Get all goals for user
 * @route   GET /api/planner/goals
 * @access  Private
 */
export const getGoals = asyncHandler(async (req, res, next) => {
  const goals = await Goal.find({ userId: req.user._id }).sort({ targetDate: 1 });

  const mockGoals = [
    { _id: 'g-1', title: 'Master Data Structures & Algorithms', type: 'study', targetDate: new Date(Date.now() + 60 * 86400000), status: 'pending' },
    { _id: 'g-2', title: 'Build full-stack TaskPilot AI project', type: 'project', targetDate: new Date(Date.now() + 90 * 86400000), status: 'pending' },
    { _id: 'g-3', title: 'Crack FAANG technical interviews', type: 'career', targetDate: new Date(Date.now() + 180 * 86400000), status: 'pending' },
  ];

  const result = goals.length > 0 ? goals : mockGoals;
  return ApiResponse.success(res, result, 'Goals retrieved successfully');
});

/**
 * @desc    Create a new goal
 * @route   POST /api/planner/goals
 * @access  Private
 */
export const createGoal = asyncHandler(async (req, res, next) => {
  const { title, description, type, targetDate } = req.body;

  const goal = await Goal.create({
    userId: req.user._id,
    title,
    description: description || '',
    type: type || 'study',
    targetDate
  });

  return ApiResponse.created(res, goal, 'Goal created successfully');
});

// ─── ROADMAPS ──────────────────────────────────────────────────────────────

/**
 * @desc    Get all roadmaps for user
 * @route   GET /api/planner/roadmaps
 * @access  Private
 */
export const getRoadmaps = asyncHandler(async (req, res, next) => {
  const roadmaps = await Roadmap.find({ userId: req.user._id }).sort({ createdAt: -1 });

  const mockRoadmaps = [
    {
      _id: 'rm-1',
      title: 'Java Backend Developer Path',
      type: 'learning',
      steps: ['Core Java Fundamentals', 'OOP & Design Patterns', 'Spring Boot Framework', 'REST APIs & Security', 'Microservices Architecture', 'Docker & Deployment']
    },
    {
      _id: 'rm-2',
      title: 'DSA Mastery Roadmap',
      type: 'skill',
      steps: ['Arrays & Strings', 'Linked Lists & Stacks', 'Trees & Graphs', 'Dynamic Programming', 'Greedy & Backtracking', 'Mock Interviews']
    },
    {
      _id: 'rm-3',
      title: 'Machine Learning Engineer',
      type: 'career',
      steps: ['Python & NumPy Basics', 'Statistics & Probability', 'Supervised Learning', 'Deep Learning & Neural Nets', 'NLP Foundations', 'Deployment & MLOps']
    }
  ];

  const result = roadmaps.length > 0 ? roadmaps : mockRoadmaps;
  return ApiResponse.success(res, result, 'Roadmaps retrieved successfully');
});

/**
 * @desc    Create a new roadmap
 * @route   POST /api/planner/roadmaps
 * @access  Private
 */
export const createRoadmap = asyncHandler(async (req, res, next) => {
  const { title, type, steps } = req.body;

  const roadmap = await Roadmap.create({
    userId: req.user._id,
    title,
    type: type || 'learning',
    steps: steps || []
  });

  return ApiResponse.created(res, roadmap, 'Roadmap created successfully');
});

// ─── REVISION PLANS ────────────────────────────────────────────────────────

/**
 * @desc    Get all revision plans
 * @route   GET /api/planner/revisions
 * @access  Private
 */
export const getRevisions = asyncHandler(async (req, res, next) => {
  const revisions = await RevisionPlan.find({ userId: req.user._id }).sort({ nextRevision: 1 });

  const mockRevisions = [
    { _id: 'rv-1', topic: 'Binary Trees & BST', interval: 7, lastRevised: new Date(Date.now() - 5 * 86400000), nextRevision: new Date(Date.now() + 2 * 86400000), progress: 75 },
    { _id: 'rv-2', topic: 'Dynamic Programming', interval: 10, lastRevised: new Date(Date.now() - 8 * 86400000), nextRevision: new Date(Date.now() + 2 * 86400000), progress: 40 },
    { _id: 'rv-3', topic: 'Spring Security JWT', interval: 14, lastRevised: new Date(Date.now() - 3 * 86400000), nextRevision: new Date(Date.now() + 11 * 86400000), progress: 90 },
  ];

  const result = revisions.length > 0 ? revisions : mockRevisions;
  return ApiResponse.success(res, result, 'Revision plans retrieved');
});

/**
 * @desc    Create a revision plan
 * @route   POST /api/planner/revisions
 * @access  Private
 */
export const createRevision = asyncHandler(async (req, res, next) => {
  const { topic, interval } = req.body;

  const nextRevision = new Date();
  nextRevision.setDate(nextRevision.getDate() + (interval || 7));

  const revision = await RevisionPlan.create({
    userId: req.user._id,
    topic,
    interval: interval || 7,
    nextRevision,
    progress: 0
  });

  return ApiResponse.created(res, revision, 'Revision plan created');
});

import { globalProviderManager } from '../providers/ProviderManager.js';

// ─── GENERATE ROADMAP (Gemini AI Provider) ──────────────────────────────────
export const generateRoadmap = asyncHandler(async (req, res, next) => {
  const { topic, goal } = req.body;
  const targetGoal = goal || topic || 'Software Engineer Career Roadmap';

  const providerResult = await globalProviderManager.executeMethod('generateRoadmap', targetGoal);

  let roadmapData = {};
  try {
    roadmapData = typeof providerResult.response === 'string' ? JSON.parse(providerResult.response) : providerResult.response;
  } catch {
    roadmapData = { goal: targetGoal, milestones: [] };
  }

  const newRoadmap = await Roadmap.create({
    userId: req.user._id,
    title: targetGoal,
    type: 'learning',
    steps: Array.isArray(roadmapData.milestones) ? roadmapData.milestones.map(m => m.title || m.description) : [targetGoal]
  });

  return ApiResponse.created(res, { roadmap: newRoadmap, data: roadmapData }, 'Roadmap generated successfully via Gemini AI');
});

export default { createPlan, getAllPlans, updatePlan, deletePlan, getCalendarEvents, createCalendarEvent, getGoals, createGoal, getRoadmaps, createRoadmap, getRevisions, createRevision, generateRoadmap };
