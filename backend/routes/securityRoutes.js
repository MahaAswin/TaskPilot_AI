import express from 'express';
import { checkLink, analyzeWebsite, checkEmail, checkPhone } from '../controllers/securityController.js';

const router = express.Router();

// POST /api/security/check-link - VirusTotal URL Reputation Scan
router.post('/check-link', checkLink);

// POST /api/security/analyze-website - urlscan.io Website Behavioral Analysis
router.post('/analyze-website', analyzeWebsite);

// POST /api/security/check-email - Abstract Email Reputation Verification
router.post('/check-email', checkEmail);

// POST /api/security/check-phone - Abstract Phone Number Intelligence & Verification
router.post('/check-phone', checkPhone);

export default router;


