import express from 'express';
import { 
  createTask, 
  batchCreateTasks,
  getTasks, 
  getTodayTasks, 
  updateTask, 
  deleteTask, 
  completeTask, 
  getAnalytics, 
  getAchievements, 
  getXP 
} from '../controllers/taskController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Secure all task paths using protect middleware if required
router.use(protect);

router.post('/create', createTask);
router.post('/batch-create', batchCreateTasks);
router.get('/all', getTasks);
router.get('/today', getTodayTasks);

router.put('/update', updateTask);
router.put('/update/:id', updateTask);

router.delete('/delete', deleteTask);
router.delete('/delete/:id', deleteTask);

router.post('/complete', completeTask);
router.post('/complete/:id', completeTask);

router.get('/analytics', getAnalytics);
router.get('/achievements', getAchievements);
router.get('/xp', getXP);

export default router;
