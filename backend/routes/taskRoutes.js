import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskRecommendations,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure all task endpoints

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/recommendations')
  .get(getTaskRecommendations);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

export default router;
