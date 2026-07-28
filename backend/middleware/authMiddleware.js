import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/AsyncHandler.js';

/**
 * Enterprise Authentication Middleware.
 * Decodes Authorization headers, verifies JWT signature, queries DB, and binds User to request.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'secret_fallback_key_taskpilot_ai'
      );
      
      // Fetch user from DB, omit password hash
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return next(ApiError.unauthorized('User associated with this token no longer exists.'));
      }

      return next();
    } catch (error) {
      return next(ApiError.unauthorized('Session validation failed. Please log in again.'));
    }
  }

  if (!token) {
    return next(ApiError.unauthorized('Authentication credentials required. Please provide token.'));
  }
});

export default protect;
