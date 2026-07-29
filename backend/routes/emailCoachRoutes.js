import express from 'express';
import {
  analyzeEmail,
  getHistory,
  getStats,
  compareReports
} from '../controllers/emailCoachController.js';

const router = express.Router();

// POST /api/email-coach/analyze - Analyze email using LanguageTool & AI
router.post('/analyze', analyzeEmail);

// GET /api/email-coach/history - Fetch past email analysis reports
router.get('/history', getHistory);

// GET /api/email-coach/stats - Fetch overall writing progress metrics
router.get('/stats', getStats);

// POST /api/email-coach/compare - Compare two specific reports
router.post('/compare', compareReports);

export default router;
