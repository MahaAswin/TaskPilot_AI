import express from 'express';
import { 
  postCoordinatorChat, 
  postCoordinatorExecute, 
  getCoordinatorStatus, 
  getCoordinatorSession 
} from './controller/CoordinatorController.js';
import protect from '../../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure all paths using JWT validator

router.post('/chat', postCoordinatorChat);
router.post('/execute', postCoordinatorExecute);
router.get('/status', getCoordinatorStatus);
router.get('/session', getCoordinatorSession);

export default router;
