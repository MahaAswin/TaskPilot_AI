import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/**
 * Validation checker middleware for express-validator.
 */
export const validateFields = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    
    return next(ApiError.badRequest('Input validation failed', errorDetails));
  }
  next();
};

export default validateFields;
