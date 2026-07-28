import { body } from 'express-validator';

export const imageValidator = [
  body('prompt').trim().notEmpty().withMessage('Prompt query is required')
];

export const flowchartValidator = [
  body('title').trim().notEmpty().withMessage('Flowchart title is required'),
  body('topic').trim().notEmpty().withMessage('Flowchart topic reference is required')
];

export const mindmapValidator = [
  body('title').trim().notEmpty().withMessage('Mindmap title is required'),
  body('topic').trim().notEmpty().withMessage('Mindmap topic reference is required')
];

export const collectionValidator = [
  body('name').trim().notEmpty().withMessage('Collection name string is required')
];
