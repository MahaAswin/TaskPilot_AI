import express from 'express';
import { 
  createNote, 
  generateNote, 
  getAllNotes, 
  getNoteById, 
  updateNote, 
  deleteNote, 
  toggleFavorite, 
  togglePin, 
  searchNotes 
} from '../controllers/knowledgeController.js';
import { 
  createValidator, 
  generateValidator, 
  updateValidator 
} from '../validators/knowledgeValidator.js';
import validateFields from '../middleware/validationMiddleware.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure all paths using JWT validator

router.post('/create', createValidator, validateFields, createNote);
router.post('/generate', generateValidator, validateFields, generateNote);
router.get('/all', getAllNotes);
router.get('/search', searchNotes);
router.put('/update', updateValidator, validateFields, updateNote);
router.delete('/delete', deleteNote);
router.put('/favorite', toggleFavorite);
router.put('/pin', togglePin);
router.get('/:id', getNoteById);

export default router;
