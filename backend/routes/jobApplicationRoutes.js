import express from 'express';
import multer from 'multer';
import { 
  searchJobs, 
  prepareApplication, 
  submitApplication, 
  getHistory 
} from '../controllers/jobApplicationController.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// POST /api/job-application/search-jobs
router.post('/search-jobs', upload.single('resume'), searchJobs);

// POST /api/job-application/prepare
router.post('/prepare', upload.single('resume'), prepareApplication);

// POST /api/job-application/submit
router.post('/submit', submitApplication);

// GET /api/job-application/history
router.get('/history', getHistory);

export default router;
