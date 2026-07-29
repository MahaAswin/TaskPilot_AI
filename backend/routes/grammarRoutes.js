import express from 'express';
import { checkGrammar } from '../controllers/grammarController.js';

const router = express.Router();

// POST /api/grammar/check
router.post('/check', checkGrammar);

export default router;
