import express from 'express';
import { summarizeDocument } from '../controllers/knowledgeController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure academic companion endpoints

router.post('/summarize', summarizeDocument);

export default router;
