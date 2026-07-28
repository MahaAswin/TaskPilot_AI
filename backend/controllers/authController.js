import asyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

/**
 * @desc    Placeholder for User Login
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  // Boilerplate login response
  const dummyPayload = {
    token: 'jwt-token-placeholder',
    user: {
      id: 'mock-user-id',
      name: 'John Doe',
      email: req.body.email || 'operator@taskpilot.ai'
    }
  };

  return ApiResponse.success(res, dummyPayload, 'Login credentials accepted successfully');
});

/**
 * @desc    Placeholder for User Register
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  // Boilerplate registration response
  const dummyPayload = {
    id: 'new-mock-user-id',
    name: req.body.name || 'Jane Doe',
    email: req.body.email || 'new-operator@taskpilot.ai'
  };

  return ApiResponse.created(res, dummyPayload, 'User registration completed successfully');
});

/**
 * @desc    Placeholder for Forgot Password request
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, null, 'Simulated password recovery link dispatched to logs');
});
