import { body } from 'express-validator';

export const planValidator = [
  body('title').trim().notEmpty().withMessage('Plan title is required'),
  body('category')
    .optional()
    .isIn(['daily', 'weekly', 'study', 'revision', 'general'])
    .withMessage('Invalid category'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority value'),
  body('plannedDate').notEmpty().withMessage('Planned date is required').isISO8601().withMessage('Invalid date format')
];

export const goalValidator = [
  body('title').trim().notEmpty().withMessage('Goal title is required'),
  body('type')
    .optional()
    .isIn(['short-term', 'long-term', 'career', 'study', 'project'])
    .withMessage('Invalid goal type'),
  body('targetDate').notEmpty().withMessage('Target date is required').isISO8601().withMessage('Invalid date format')
];

export const roadmapValidator = [
  body('title').trim().notEmpty().withMessage('Roadmap title is required'),
  body('type')
    .optional()
    .isIn(['learning', 'career', 'skill', 'project'])
    .withMessage('Invalid roadmap type')
];

export const revisionValidator = [
  body('topic').trim().notEmpty().withMessage('Revision topic is required'),
  body('interval').optional().isInt({ min: 1 }).withMessage('Interval must be a positive integer')
];

export const calendarEventValidator = [
  body('title').trim().notEmpty().withMessage('Event title is required'),
  body('start').notEmpty().withMessage('Start date is required').isISO8601().withMessage('Invalid date format'),
  body('category')
    .optional()
    .isIn(['exam', 'class', 'deadline', 'revision', 'study', 'milestone'])
    .withMessage('Invalid event category')
];
