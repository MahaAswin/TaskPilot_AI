import asyncHandler from '../utils/AsyncHandler.js';
import ApiError from '../utils/ApiError.js';
import securityService from '../services/securityService.js';
import { validateLinkCheckInput, validateEmailCheckInput, validatePhoneCheckInput } from '../validators/securityValidator.js';

/**
 * @desc    Checks URL reputation using VirusTotal API
 * @route   POST /api/security/check-link
 * @access  Public / Private
 */
export const checkLink = asyncHandler(async (req, res, next) => {
  const validation = validateLinkCheckInput(req.body);

  if (!validation.isValid) {
    return next(ApiError.badRequest('Invalid URL format', validation.errors));
  }

  const result = await securityService.checkLink(validation.normalizedUrl, {
    user: req.user || null
  });

  return res.status(200).json(result);
});

/**
 * @desc    Performs behavioral website analysis using urlscan.io API
 * @route   POST /api/security/analyze-website
 * @access  Public / Private
 */
export const analyzeWebsite = asyncHandler(async (req, res, next) => {
  const validation = validateLinkCheckInput(req.body);

  if (!validation.isValid) {
    return next(ApiError.badRequest('Invalid URL format', validation.errors));
  }

  const result = await securityService.analyzeWebsite(validation.normalizedUrl, {
    user: req.user || null
  });

  return res.status(200).json(result);
});

/**
 * @desc    Verifies email reputation and quality using Abstract Email Reputation API
 * @route   POST /api/security/check-email
 * @access  Public / Private
 */
export const checkEmail = asyncHandler(async (req, res, next) => {
  const validation = validateEmailCheckInput(req.body);

  if (!validation.isValid) {
    return next(ApiError.badRequest('Invalid email format', validation.errors));
  }

  const result = await securityService.checkEmail(validation.email, {
    user: req.user || null
  });

  return res.status(200).json(result);
});

/**
 * @desc    Verifies phone number intelligence and carrier details using Abstract Phone API
 * @route   POST /api/security/check-phone
 * @access  Public / Private
 */
export const checkPhone = asyncHandler(async (req, res, next) => {
  const validation = validatePhoneCheckInput(req.body);

  if (!validation.isValid) {
    return next(ApiError.badRequest('Invalid phone format', validation.errors));
  }

  const result = await securityService.checkPhone(validation.phone, {
    user: req.user || null
  });

  return res.status(200).json(result);
});

export default {
  checkLink,
  analyzeWebsite,
  checkEmail,
  checkPhone
};


