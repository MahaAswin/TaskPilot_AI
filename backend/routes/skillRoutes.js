import express from 'express';
import {
  getProfile,
  getCategories,
  getReports,
  getTimeline,
  getRecommendations,
  updateProfile,
  analyzeSkills
} from '../controllers/skillController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.get('/categories', getCategories);
router.get('/reports', getReports);
router.get('/timeline', getTimeline);
router.get('/recommendations', getRecommendations);
router.put('/update', updateProfile);
router.post('/analyze', analyzeSkills);

export default router;
