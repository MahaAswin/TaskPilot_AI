import express from 'express';
import { generateRoadmap } from '../controllers/plannerController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure planner endpoints

router.post('/roadmap', generateRoadmap);

export default router;
