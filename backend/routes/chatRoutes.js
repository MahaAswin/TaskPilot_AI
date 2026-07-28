import express from 'express';
import {
  createChat,
  getChats,
  getChatMessages,
  deleteChat,
  sendMessageStream,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure all chat endpoints

router.route('/')
  .post(createChat)
  .get(getChats);

router.route('/:id')
  .delete(deleteChat);

router.route('/:id/messages')
  .get(getChatMessages);

router.route('/:id/message')
  .post(sendMessageStream);

export default router;
