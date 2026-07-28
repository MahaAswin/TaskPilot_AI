import express from 'express';
import {
  getDashboard,
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  getRecommendations,
  getFocusSessions,
  startFocusSession,
  endFocusSession,
  updateProfile
} from '../controllers/productivityController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/daily', getDailyReport);
router.get('/weekly', getWeeklyReport);
router.get('/monthly', getMonthlyReport);
router.get('/recommendations', getRecommendations);
router.get('/focus', getFocusSessions);

router.post('/session/start', startFocusSession);
router.post('/session/end', endFocusSession);
router.put('/update', updateProfile);

export default router;
