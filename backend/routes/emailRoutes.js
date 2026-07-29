import express from 'express';
import {
  googleLogin,
  googleCallback,
  googleStatus,
  googleDisconnect,
  generateEmail,
  sendEmail
} from '../controllers/emailController.js';

const router = express.Router();

// GET /api/email/google/login - Initiate Google OAuth 2.0 Login
router.get('/google/login', googleLogin);

// GET /api/email/google/callback - Google OAuth Redirect Callback Code Handler
router.get('/google/callback', googleCallback);

// GET /api/email/google/status - Gmail Connection Status
router.get('/google/status', googleStatus);

// POST /api/email/google/disconnect - Disconnect Gmail Account
router.post('/google/disconnect', googleDisconnect);

// POST /api/email/generate - Generate AI Email Content
router.post('/generate', generateEmail);

// POST /api/email/send - Dispatch Email via Gmail API
router.post('/send', sendEmail);

export default router;
