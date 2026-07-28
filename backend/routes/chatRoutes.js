import express from 'express';
import { createChatSession, getChatSessions, deleteChatSession, postChatMessage } from '../controllers/chatController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure all chat paths

router.route('/')
  .post(createChatSession)
  .get(getChatSessions);

router.route('/:id')
  .delete(deleteChatSession);

router.route('/:id/message')
  .post(postChatMessage);

export default router;
