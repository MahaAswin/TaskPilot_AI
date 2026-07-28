import express from 'express';
import {
  chat,
  summarizeText,
  generateNotes,
  generateQuiz,
  generateFlashcards,
  generateStudyPlan,
  generateRoadmap,
  generateTasks,
  generateInterviewQuestions,
  generateMermaidDiagram,
  generateMindMapJSON,
  getProviders,
  getProviderHealth
} from '../controllers/aiController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/chat', chat);
router.post('/summarize', summarizeText);
router.post('/notes', generateNotes);
router.post('/quiz', generateQuiz);
router.post('/flashcards', generateFlashcards);
router.post('/study-plan', generateStudyPlan);
router.post('/roadmap', generateRoadmap);
router.post('/tasks', generateTasks);
router.post('/interview', generateInterviewQuestions);
router.post('/diagram', generateMermaidDiagram);
router.post('/mindmap', generateMindMapJSON);

router.get('/providers', getProviders);
router.get('/provider-health', getProviderHealth);

export default router;
