import asyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { aiService } from '../services/aiService.js';

export const chat = asyncHandler(async (req, res) => {
  const data = await aiService.chat(req.body.messages, req.body.options || {});
  return ApiResponse.success(res, data, 'AI Chat response synthesized');
});

export const generateText = asyncHandler(async (req, res) => {
  const data = await aiService.generateText(req.body.prompt, req.body.options || {});
  return ApiResponse.success(res, data, 'AI Text generated');
});

export const summarizeText = asyncHandler(async (req, res) => {
  const data = await aiService.summarizeText(req.body.text, req.body.options || {});
  return ApiResponse.success(res, data, 'AI Summary generated');
});

export const explainTopic = asyncHandler(async (req, res) => {
  const data = await aiService.explainTopic(req.body.topic, req.body.options || {});
  return ApiResponse.success(res, data, 'AI Explanation generated');
});

export const generateImage = asyncHandler(async (req, res) => {
  const data = await aiService.generateImage(req.body.prompt, req.body.options || {});
  return ApiResponse.success(res, data, 'AI Image asset generated');
});

export const generateDiagram = asyncHandler(async (req, res) => {
  const data = await aiService.generateDiagram(req.body.prompt, req.body.options || {});
  return ApiResponse.success(res, data, 'AI Diagram generated');
});

export const generateMindMap = asyncHandler(async (req, res) => {
  const data = await aiService.generateMindMap(req.body.prompt, req.body.options || {});
  return ApiResponse.success(res, data, 'AI MindMap generated');
});

export const generateQuiz = asyncHandler(async (req, res) => {
  const data = await aiService.generateQuiz(req.body.topic, req.body.options || {});
  return ApiResponse.success(res, data, 'AI Quiz generated');
});

export const generateFlashcards = asyncHandler(async (req, res) => {
  const data = await aiService.generateFlashcards(req.body.topic, req.body.options || {});
  return ApiResponse.success(res, data, 'AI Flashcards generated');
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
  generateText,
  summarizeText,
  explainTopic,
  generateImage,
  generateDiagram,
  generateMindMap,
  generateQuiz,
  generateFlashcards,
  getProviders,
  getProviderHealth
};
