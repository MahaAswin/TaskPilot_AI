import express from 'express';
import {
  createPlanningCanvas,
  getAllPlanningCanvases,
  getPlanningCanvasById,
  updatePlanningCanvas,
  deletePlanningCanvas,
  exportPlanningCanvas
} from '../controllers/planningController.js';

const router = express.Router();

// Planning Canvas Endpoints
router.post('/create', createPlanningCanvas);
router.get('/all', getAllPlanningCanvases);
router.get('/:id', getPlanningCanvasById);
router.put('/update', updatePlanningCanvas);
router.delete('/delete', deletePlanningCanvas);
router.post('/export', exportPlanningCanvas);

export default router;
