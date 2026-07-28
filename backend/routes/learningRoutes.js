import express from 'express';
import { 
  startSession, 
  continueSession, 
  getHistory, 
  getBookmarks, 
  toggleBookmark, 
  getQuizzes, 
  getFlashcards 
} from '../controllers/learningController.js';
import { 
  startValidator, 
  bookmarkValidator 
} from '../validators/learningValidator.js';
import validateFields from '../middleware/validationMiddleware.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure routes with active auth middleware

router.post('/start', startValidator, validateFields, startSession);
router.post('/continue', continueSession);
router.get('/history', getHistory);
router.get('/bookmarks', getBookmarks);
router.post('/bookmark', bookmarkValidator, validateFields, toggleBookmark);
router.post('/quiz', getQuizzes);
router.post('/flashcards', getFlashcards);

export default router;
