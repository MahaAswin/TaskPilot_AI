import asyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { aiService } from '../services/aiService.js';

export const chat = asyncHandler(async (req, res) => {
  const messages = Array.isArray(req.body.messages) && req.body.messages.length > 0
    ? req.body.messages
    : [{ role: 'user', content: req.body.prompt || req.body.query || 'Hello' }];

  const data = await aiService.chat(messages, req.body.options || {});
  return ApiResponse.success(res, data, 'AI Chat response synthesized');
});

export const summarizeText = asyncHandler(async (req, res) => {
  const data = await aiService.summarize(req.body.text || req.body.prompt || req.body.topic || 'General Topic', req.body.options || {});
  return ApiResponse.success(res, data, 'AI Summary generated');
});

export const generateNotes = asyncHandler(async (req, res) => {
  const data = await aiService.generateNotes(req.body.topic || req.body.prompt || req.body.title || 'General Topic', req.body.options || {});
  return ApiResponse.success(res, data, 'AI Notes generated');
});

export const generateQuiz = asyncHandler(async (req, res) => {
  const data = await aiService.generateQuiz(req.body.topic || req.body.prompt || 'General Topic', req.body.options || {});
  return ApiResponse.success(res, data, 'AI Quiz generated');
});

export const generateFlashcards = asyncHandler(async (req, res) => {
  const data = await aiService.generateFlashcards(req.body.topic || req.body.prompt || 'General Topic', req.body.options || {});
  return ApiResponse.success(res, data, 'AI Flashcards generated');
});

export const generateStudyPlan = asyncHandler(async (req, res) => {
  const data = await aiService.generateStudyPlan(req.body.topic || req.body.prompt || 'General Goal', req.body.options || {});
  return ApiResponse.success(res, data, 'AI Study Plan generated');
});

export const generateRoadmap = asyncHandler(async (req, res) => {
  const data = await aiService.generateRoadmap(req.body.goal || req.body.topic || req.body.prompt || 'Career Roadmap', req.body.options || {});
  return ApiResponse.success(res, data, 'AI Roadmap generated');
});

export const generateTasks = asyncHandler(async (req, res) => {
  const data = await aiService.generateTasks(req.body.goal || req.body.topic || req.body.prompt || 'General Goal', req.body.options || {});
  return ApiResponse.success(res, data, 'AI Actionable Tasks generated');
});

export const generateInterviewQuestions = asyncHandler(async (req, res) => {
  const data = await aiService.generateInterviewQuestions(req.body.topic || req.body.prompt || 'Software Engineering', req.body.options || {});
  return ApiResponse.success(res, data, 'AI Interview Questions generated');
});

export const generateMermaidDiagram = asyncHandler(async (req, res) => {
  const data = await aiService.generateMermaidDiagram(req.body.topic || req.body.prompt || 'System Architecture', req.body.options || {});
  return ApiResponse.success(res, data, 'AI Mermaid Diagram generated');
});

export const generateMindMapJSON = asyncHandler(async (req, res) => {
  const data = await aiService.generateMindMapJSON(req.body.topic || req.body.prompt || 'Mindmap Topic', req.body.options || {});
  return ApiResponse.success(res, data, 'AI MindMap JSON generated');
});

export const getProviders = asyncHandler(async (req, res) => {
  const data = await aiService.getProvidersData();
  return ApiResponse.success(res, data, 'AI Providers registry fetched');
});

export const getProviderHealth = asyncHandler(async (req, res) => {
  const data = await aiService.getHealthData();
  return ApiResponse.success(res, data, 'AI Provider Health statuses fetched');
});

export default {
  chat,
  summarizeText,
  generateNotes,
  generateQuiz,
  generateFlashcards,
  generateStudyPlan,
  generateRoadmap,
  generateTasks,
  generateInterviewQuestions,
  generateMermaidDiagram,
  generateMindMapJSON,
  getProviders,
  getProviderHealth
};
