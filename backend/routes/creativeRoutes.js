import express from 'express';
import { generateGraphics } from '../controllers/creativeController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure graphics generation endpoints

router.post('/generate', generateGraphics);

export default router;
