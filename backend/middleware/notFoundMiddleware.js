import ApiError from '../utils/ApiError.js';

/**
 * 404 Not Found Middleware router.
 */
export const notFound = (req, res, next) => {
  next(ApiError.notFound(`Endpoint not found - ${req.originalUrl}`));
};

export default notFound;
