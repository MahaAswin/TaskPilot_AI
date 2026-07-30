import asyncHandler from '../utils/AsyncHandler.js';
import ApiError from '../utils/ApiError.js';
import emailService from '../services/emailService.js';
import { validateEmailGenerateInput, validateEmailSendInput } from '../validators/emailValidator.js';

/**
 * @desc    Initiates Google OAuth 2.0 Login Flow
 * @route   GET /api/email/google/login
 * @access  Public / Private
 */
export const googleLogin = asyncHandler(async (req, res) => {
  const userId = req.user?._id?.toString() || '';
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/email/google/callback';
  console.log("[OAuth Debug] GOOGLE_CLIENT_ID (sent):", JSON.stringify(process.env.GOOGLE_CLIENT_ID));
  console.log("[OAuth Debug] GOOGLE_REDIRECT_URI (sent):", JSON.stringify(redirectUri));
  const url = emailService.getGoogleAuthUrl(userId);
  console.log("[OAuth Debug] Generated Google Auth URL:", url);
  return res.status(200).json({ url });
});



/**
 * @desc    Handles Google OAuth 2.0 Redirect Callback Code
 * @route   GET /api/email/google/callback
 * @access  Public / Private
 */
export const googleCallback = asyncHandler(async (req, res, next) => {
  const { code, state } = req.query;

  if (!code) {
    return next(ApiError.badRequest('OAuth authorization code is missing from request query.'));
  }

  const userId = req.user?._id?.toString() || state || null;
  const result = await emailService.handleGoogleCallback(code, userId);

  // Redirect to frontend Email Agent page with connection state
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  return res.redirect(`${clientUrl}/email-agent?connected=true&email=${encodeURIComponent(result.email)}`);
});

/**
 * @desc    Fetches current Gmail connection status
 * @route   GET /api/email/google/status
 * @access  Public / Private
 */
export const googleStatus = asyncHandler(async (req, res) => {
  const userId = req.user?._id?.toString() || null;
  const status = await emailService.getGoogleConnectionStatus(userId);
  return res.status(200).json(status);
});

/**
 * @desc    Disconnects current Gmail account
 * @route   POST /api/email/google/disconnect
 * @access  Public / Private
 */
export const googleDisconnect = asyncHandler(async (req, res) => {
  const userId = req.user?._id?.toString() || null;
  const result = await emailService.disconnectGoogle(userId);
  return res.status(200).json(result);
});

/**
 * @desc    Generates AI email subject and body content
 * @route   POST /api/email/generate
 * @access  Public / Private
 */
export const generateEmail = asyncHandler(async (req, res, next) => {
  console.log(`\n[emailController] POST /api/email/generate received payload:`, {
    action: req.body?.action,
    tone: req.body?.tone,
    promptLength: req.body?.prompt?.length || 0,
    hasExistingBody: Boolean(req.body?.existingBody)
  });

  const validation = validateEmailGenerateInput(req.body);

  if (!validation.isValid) {
    console.warn(`[emailController] Validation failed:`, validation.errors);
    return next(ApiError.badRequest('Invalid generation request', validation.errors));
  }

  const result = await emailService.generateEmail(validation.data);

  console.log(`[emailController] Email generation complete. Responding with subject: "${result.subject}"`);

  return res.status(200).json({
    subject: result.subject,
    body: result.body,
    tone: result.tone,
    action: result.action
  });
});

/**
 * @desc    Sends approved email via Gmail API
 * @route   POST /api/email/send
 * @access  Public / Private
 */
export const sendEmail = asyncHandler(async (req, res, next) => {
  const validation = validateEmailSendInput(req.body);

  if (!validation.isValid) {
    return next(ApiError.badRequest('Invalid email payload', validation.errors));
  }

  const userId = req.user?._id?.toString() || null;
  const result = await emailService.sendEmail(validation.data, userId);

  return res.status(200).json({
    status: result.status || 'SUCCESS',
    message: result.message || 'Email sent successfully.'
  });
});


export default {
  googleLogin,
  googleCallback,
  googleStatus,
  googleDisconnect,
  generateEmail,
  sendEmail
};
