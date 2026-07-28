import { body } from 'express-validator';

export const startValidator = [
  body('topic').trim().notEmpty().withMessage('Session topic is required')
];

export const bookmarkValidator = [
  body('contentType').isIn(['note', 'flashcard', 'question', 'topic']).withMessage('Invalid bookmark contentType reference'),
  body('title').trim().notEmpty().withMessage('Bookmark title description is required'),
  body('referenceId').notEmpty().withMessage('Bookmark referenceId is required').isMongoId().withMessage('Invalid referenceId MongoDB layout')
];

export const historyValidator = [
  body('activityType').isIn(['read', 'quiz', 'flashcards', 'challenge']).withMessage('Invalid history activityType reference'),
  body('topic').trim().notEmpty().withMessage('History topic description is required')
];
