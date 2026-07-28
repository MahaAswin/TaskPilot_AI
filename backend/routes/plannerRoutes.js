import express from 'express';
import {
  createPlan, getAllPlans, updatePlan, deletePlan,
  getCalendarEvents, createCalendarEvent,
  getGoals, createGoal,
  getRoadmaps, createRoadmap,
  getRevisions, createRevision,
  generateRoadmap
} from '../controllers/plannerController.js';
import {
  planValidator, goalValidator, roadmapValidator,
  revisionValidator, calendarEventValidator
} from '../validators/plannerValidator.js';
import validateFields from '../middleware/validationMiddleware.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Plans
router.post('/create', planValidator, validateFields, createPlan);
router.get('/all', getAllPlans);
router.put('/update', planValidator, validateFields, updatePlan);
router.delete('/delete', deletePlan);

// Calendar
router.get('/calendar', getCalendarEvents);
router.post('/calendar', calendarEventValidator, validateFields, createCalendarEvent);

// Goals
router.get('/goals', getGoals);
router.post('/goals', goalValidator, validateFields, createGoal);

// Roadmaps
router.get('/roadmaps', getRoadmaps);
router.post('/roadmaps', roadmapValidator, validateFields, createRoadmap);
router.post('/roadmap', generateRoadmap); // coordinator agent placeholder

// Revisions
router.get('/revisions', getRevisions);
router.post('/revisions', revisionValidator, validateFields, createRevision);

export default router;
