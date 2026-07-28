import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/AsyncHandler.js';

// Helper to sign JWTs
const signToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET || 'secret_fallback_key_taskpilot_ai', 
    { expiresIn: '30d' }
  );
};

// Helper to filter password field from return details
const formatUserObj = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  profileImage: user.profileImage,
  role: user.role,
  level: user.level,
  xp: user.xp,
  streak: user.streak,
  productivityScore: user.productivityScore,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(ApiError.badRequest('An account is already registered with this email address.'));
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = signToken(user._id);

  return ApiResponse.created(res, {
    token,
    user: formatUserObj(user)
  }, 'Operator registration completed successfully');
});

/**
 * @desc    Login existing user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(ApiError.unauthorized('Invalid email or password credentials.'));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(ApiError.unauthorized('Invalid email or password credentials.'));
  }

  const token = signToken(user._id);

  return ApiResponse.success(res, {
    token,
    user: formatUserObj(user)
  }, 'Credentials accepted successfully');
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(ApiError.notFound('Operator profile not found.'));
  }

  return ApiResponse.success(res, formatUserObj(user), 'Current user profile fetched');
});

/**
 * @desc    Update user profile data
 * @route   PUT /api/auth/update-profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, email, profileImage } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(ApiError.notFound('Operator profile not found.'));
  }

  // Check email conflict
  if (email && email !== user.email) {
    const emailConflict = await User.findOne({ email });
    if (emailConflict) {
      return next(ApiError.badRequest('This email address is already claimed by another operator.'));
    }
    user.email = email;
  }

  if (name) user.name = name;
  if (profileImage !== undefined) user.profileImage = profileImage;

  await user.save();

  return ApiResponse.success(res, formatUserObj(user), 'Profile configuration updated successfully');
});

/**
 * @desc    Change account password
 * @route   POST /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(ApiError.notFound('Operator profile not found.'));
  }

  const isMatch = await user.matchPassword(oldPassword);
  if (!isMatch) {
    return next(ApiError.badRequest('The current password entered is incorrect.'));
  }

  user.password = newPassword;
  await user.save();

  return ApiResponse.success(res, null, 'Account password updated successfully');
});

/**
 * @desc    Request forgot password recovery token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Return standard success to prevent email verification scans
    return ApiResponse.success(res, null, 'If an account is associated with this email, a recovery token has been dispatched.');
  }

  // Generate short recovery token
  const resetToken = uuidv4().substring(0, 8).toUpperCase();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 Hour

  await user.save();

  console.log(`[PASSWORD RECOVERY LOG] Token for ${email}: ${resetToken}`);

  // In production we would email it, here we return it in meta-data for easy developer sandbox integrations
  return ApiResponse.success(res, { resetToken }, 'Password recovery token generated successfully');
});

/**
 * @desc    Execute password reset using token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: new Date() }
  });

  if (!user) {
    return next(ApiError.badRequest('The recovery token is invalid or has expired.'));
  }

  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;

  await user.save();

  return ApiResponse.success(res, null, 'Account password reset successfully. Please log in.');
});
