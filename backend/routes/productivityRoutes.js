import express from 'express';
import { getChartHistory, getCoachReport } from '../controllers/productivityController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure metrics endpoints

router.get('/history', getChartHistory);
router.post('/coach', getCoachReport);

export default router;
