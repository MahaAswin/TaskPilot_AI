import express from 'express';
import {
  getDashboardSummary,
  getProductivityHistory,
  triggerCoachReport,
} from '../controllers/productivityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure all productivity analytics endpoints

router.get('/dashboard', getDashboardSummary);
router.get('/history', getProductivityHistory);
router.post('/coach-report', triggerCoachReport);

export default router;
