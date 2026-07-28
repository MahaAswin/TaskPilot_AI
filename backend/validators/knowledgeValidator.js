import { body } from 'express-validator';

export const createValidator = [
  body('title').trim().notEmpty().withMessage('Note title is required'),
  body('topic').trim().notEmpty().withMessage('Note topic is required'),
  body('content').notEmpty().withMessage('Note content body is required')
];

export const generateValidator = [
  body('title').trim().notEmpty().withMessage('Note title is required'),
  body('topic').trim().notEmpty().withMessage('Note topic is required'),
  body('keywords').notEmpty().withMessage('Keywords list is required')
];

export const updateValidator = [
  body('id').trim().notEmpty().withMessage('Note ID parameter is required').isMongoId().withMessage('Invalid MongoDB ID format'),
  body('title').trim().notEmpty().withMessage('Note title is required'),
  body('topic').trim().notEmpty().withMessage('Note topic is required'),
  body('content').notEmpty().withMessage('Note content body is required')
];
