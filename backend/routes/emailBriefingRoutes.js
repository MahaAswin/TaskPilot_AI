import express from 'express';
import multer from 'multer';
import {
  analyzeBriefing,
  getHistory,
  generateReply
} from '../controllers/emailBriefingController.js';

const router = express.Router();

// Memory storage for multer file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// POST /api/email-briefing/analyze - Text or File upload analysis
router.post('/analyze', upload.single('file'), analyzeBriefing);

// GET /api/email-briefing/history - Fetch past executive briefing reports
router.get('/history', getHistory);

// POST /api/email-briefing/reply - Generate quick AI email reply draft
router.post('/reply', generateReply);

export default router;
