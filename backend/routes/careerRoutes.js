import express from 'express';
import multer from 'multer';
import { analyzeCareer, generateCoverLetter } from '../controllers/careerController.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// POST /api/career/analyze - Analyze career profile & search jobs
router.post('/analyze', upload.single('resumeFile'), analyzeCareer);

// POST /api/career/cover-letter - Generate AI cover letter
router.post('/cover-letter', generateCoverLetter);

export default router;
