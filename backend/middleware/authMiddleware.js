import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

/**
 * Enterprise Authentication Middleware.
 * Decodes Authorization headers and places session credentials on the request object.
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      
      // Bind placeholder credentials details
      req.user = {
        _id: decoded.id || 'placeholder_user_id',
        role: 'operator'
      };

      return next();
    } catch (error) {
      return next(ApiError.unauthorized('Not authorized, token validation failed'));
    }
  }

  if (!token) {
    return next(ApiError.unauthorized('Not authorized, no token provided'));
  }
};

export default protect;
