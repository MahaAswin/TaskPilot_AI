import express from 'express';
import { 
  createChatSession, 
  getChatSessions, 
  updateChatSession, 
  deleteChatSession, 
  getChatMessages, 
  postChatMessage, 
  uploadChatFile, 
  exportChatHistory 
} from '../controllers/chatController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure all chat/workspace routes

router.route('/')
  .post(createChatSession)
  .get(getChatSessions);

router.route('/upload')
  .post(uploadChatFile);

router.route('/:id')
  .put(updateChatSession)
  .delete(deleteChatSession);

router.route('/:id/messages')
  .get(getChatMessages);

router.route('/:id/message')
  .post(postChatMessage);

router.route('/:id/export')
  .post(exportChatHistory);

export default router;
