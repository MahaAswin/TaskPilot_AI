import express from 'express';
import {
  runWorkflow,
  getWorkflows,
  getHistory,
  getContext,
  getLogs,
  replayWorkflow
} from '../controllers/orchestratorController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/run', runWorkflow);
router.get('/workflows', getWorkflows);
router.get('/history', getHistory);
router.get('/context', getContext);
router.get('/logs', getLogs);
router.post('/replay', replayWorkflow);

export default router;
