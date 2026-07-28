import ApiError from '../utils/ApiError.js';

/**
 * Enterprise Global Error Handler.
 * Intercepts ApiError or standard exceptions and formats them as standard JSON.
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If error is not an instance of custom ApiError, wrap it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, [], err.stack);
  }

  const response = {
    success: error.success,
    message: error.message,
    statusCode: error.statusCode,
    errors: error.errors,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  };

  res.status(error.statusCode).json(response);
};

export default errorHandler;
