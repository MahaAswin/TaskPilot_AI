import express from 'express';
import {
  chat,
  generateText,
  summarizeText,
  explainTopic,
  generateImage,
  generateDiagram,
  generateMindMap,
  generateQuiz,
  generateFlashcards,
  getProviders,
  getProviderHealth
} from '../controllers/aiController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/chat', chat);
router.post('/generate', generateText);
router.post('/summarize', summarizeText);
router.post('/explain', explainTopic);
router.post('/image', generateImage);
router.post('/diagram', generateDiagram);
router.post('/mindmap', generateMindMap);
router.post('/quiz', generateQuiz);
router.post('/flashcards', generateFlashcards);

router.get('/providers', getProviders);
router.get('/provider-health', getProviderHealth);

export default router;
